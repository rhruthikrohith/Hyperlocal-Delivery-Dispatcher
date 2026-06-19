import Order from '../models/OrderModel.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

// Helper to calculate coordinates distance and pricing deterministically based on addresses or real coordinates
const calculateOrderMetrics = (pickupAddress, deliveryAddress, pickupCoords, deliveryCoords, isEmergency = false) => {
  let distance;
  if (pickupCoords && pickupCoords.lat && pickupCoords.lng && deliveryCoords && deliveryCoords.lat && deliveryCoords.lng) {
    const R = 6371; // km
    const dLat = (deliveryCoords.lat - pickupCoords.lat) * Math.PI / 180;
    const dLng = (deliveryCoords.lng - pickupCoords.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(deliveryCoords.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    distance = parseFloat((R * c).toFixed(1));
  } else {
    // Fallback to hash-based simulation
    const combined = ((pickupAddress || '') + (deliveryAddress || '')).trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = (Math.abs(hash) % 1000) / 1000;
    distance = parseFloat((seed * (12 - 1.5) + 1.5).toFixed(1));
  }

  // Flat fee $3.00 + $1.50 per km
  let deliveryFee = parseFloat((3.0 + distance * 1.5).toFixed(2));
  // ETA: 8 minutes prep + 3 minutes per km
  let eta = Math.round(8 + distance * 3);

  // Apply Emergency Priority Surcharge and Express ETA
  if (isEmergency) {
    deliveryFee = parseFloat((deliveryFee + 5.0).toFixed(2)); // $5 priority medicine/urgent fee
    eta = Math.max(5, Math.round(eta * 0.7)); // 30% faster ETA, min 5 mins
  }

  return { distance, deliveryFee, eta };
};

// Helper to simulate coordinates of a Telangana location matching the frontend hash logic
const getAddressCoordinates = (address) => {
  const clean = (address || '').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = (Math.abs(hash) % 1000) / 1000;
  // Hyderabad Telangana coordinates bounds
  const lat = 17.35 + seed * 0.15;
  const lng = 78.35 + seed * 0.15;
  return { lat, lng };
};

// Automate assignment of the nearest online and available rider
export const autoAssignNearestRider = async (order) => {
  try {
    if (order.deliveryType === 'Scheduled' && order.searchStatus === 'None') {
      return null; // Do not assign scheduled orders until release time
    }

    const coords = order.pickupLocation && order.pickupLocation.lat ? order.pickupLocation : getAddressCoordinates(order.pickupAddress);
    
    // Find online, available riders who are not in the declinedRiders list
    const query = {
      role: 'rider',
      riderStatus: 'online',
      riderWorkload: 'available',
      _id: { $nin: order.declinedRiders || [] }
    };
    
    const riders = await User.find(query);
    if (riders.length === 0) {
      // Prevent duplicate DB writes if already in Not Found state
      if (order.status === 'Pending' && order.searchStatus === 'Not Found') {
        return null;
      }

      // No available riders nearby
      order.rider = undefined;
      order.status = 'Pending';
      order.searchStatus = 'Not Found';
      
      const lastEvent = order.timeline[order.timeline.length - 1];
      if (!lastEvent || lastEvent.note !== 'No available riders nearby') {
        order.timeline.push({
          status: 'Pending',
          timestamp: new Date(),
          note: 'No available riders nearby'
        });
      }
      await order.save();
      return null;
    }
    
    // Calculate distance for each rider and sort
    const ridersWithDistance = riders.map(rider => {
      let distance = 0;
      if (coords && rider.currentLocation) {
        // Haversine formula calculation
        const R = 6371; // km
        const dLat = (rider.currentLocation.lat - coords.lat) * Math.PI / 180;
        const dLng = (rider.currentLocation.lng - coords.lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(coords.lat * Math.PI / 180) * Math.cos(rider.currentLocation.lat * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
      }
      return {
        rider,
        distanceToPickup: distance
      };
    });
    
    // Sort riders by distance (nearest first)
    ridersWithDistance.sort((a, b) => a.distanceToPickup - b.distanceToPickup);
    
    const nearest = ridersWithDistance[0].rider;
    order.rider = nearest._id;
    order.status = 'Assigned';
    order.searchStatus = 'Assigned';
    order.assignedAt = new Date();
    order.timeline.push({
      status: 'Assigned',
      timestamp: new Date(),
      note: `Automatically assigned to nearest rider: ${nearest.name} (${ridersWithDistance[0].distanceToPickup.toFixed(2)} km away)`
    });
    
    await order.save();
    return nearest;
  } catch (error) {
    console.error('Error in autoAssignNearestRider:', error.message);
    return null;
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      pickupAddress,
      deliveryAddress,
      items,
      paymentMethod,
      pickupPhone,
      deliveryPhone,
      pickupLocation,
      deliveryLocation,
      deliveryType,
      scheduledTime,
      isEmergency
    } = req.body;

    if (!customerName || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({ message: 'Customer name, pickup address, and delivery address are required' });
    }

    // Determine coordinates bounds
    let pickupCoords = pickupLocation;
    let deliveryCoords = deliveryLocation;

    if (!pickupCoords || !pickupCoords.lat || !pickupCoords.lng) {
      pickupCoords = getAddressCoordinates(pickupAddress);
    }
    if (!deliveryCoords || !deliveryCoords.lat || !deliveryCoords.lng) {
      deliveryCoords = getAddressCoordinates(deliveryAddress);
    }

    // Determine role of creator
    const creator = await User.findById(req.userId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator user not found' });
    }

    const isEmergencyBool = isEmergency === true || isEmergency === 'true';

    const { distance, deliveryFee, eta } = calculateOrderMetrics(
      pickupAddress,
      deliveryAddress,
      pickupCoords,
      deliveryCoords,
      isEmergencyBool
    );

    // Parse items and calculate total amount
    const parsedItems = items && items.length > 0 ? items : [{ name: 'Standard Package', quantity: 1, price: 15.00 }];
    const totalAmount = parseFloat(parsedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));

    const isCod = paymentMethod === 'COD';
    const codAmount = isCod ? parseFloat((totalAmount + deliveryFee).toFixed(2)) : 0;

    const orderData = {
      customerName,
      pickupAddress,
      deliveryAddress,
      pickupLocation: pickupCoords,
      deliveryLocation: deliveryCoords,
      items: parsedItems,
      totalAmount,
      pickupPhone: pickupPhone || '',
      deliveryPhone: deliveryPhone || '',
      distance,
      deliveryFee,
      eta,
      paymentMethod: paymentMethod || 'Prepaid',
      codAmount,
      deliveryType: deliveryType || 'Instant',
      scheduledTime: deliveryType === 'Scheduled' ? new Date(scheduledTime || Date.now()) : undefined,
      isEmergency: isEmergencyBool,
      status: 'Pending',
      searchStatus: deliveryType === 'Scheduled' ? 'None' : 'Searching',
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: deliveryType === 'Scheduled'
            ? `Order successfully scheduled for ${new Date(scheduledTime).toLocaleString()}`
            : 'Order created successfully'
        }
      ]
    };

    orderData.customerId = creator._id;

    const order = await Order.create(orderData);
    
    // Auto-assign the nearest rider immediately if it is an Instant order
    if (order.deliveryType !== 'Scheduled') {
      await autoAssignNearestRider(order);
    }
    
    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (with filters)
export const getOrders = async (req, res) => {
  try {
    const filters = {};
    
    // Role-based query isolation
    if (req.headers.authorization) {
      // If user is authenticated, we filter accordingly
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          if (user.role === 'customer') {
            filters.customerId = user._id;
          } else if (user.role === 'rider') {
            // Riders see their assigned jobs or pending orders that are active (Instant, or Scheduled and released)
            filters.$or = [
              { rider: user._id },
              { 
                status: 'Pending',
                $or: [
                  { deliveryType: { $ne: 'Scheduled' } },
                  { 
                    deliveryType: 'Scheduled',
                    searchStatus: { $in: ['Searching', 'Not Found'] }
                  }
                ]
              }
            ];
          }
        }
      } catch (e) {
        // Token verification failed or empty, return all (backward compatible)
      }
    }

    const orders = await Order.find(filters)
      .populate('rider', 'name email phone riderStatus currentLocation')
      .populate('customerId', 'name email phone')
      .populate('vendorId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order details (simple update)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin manually assigns a rider to an order
export const assignRider = async (req, res) => {
  try {
    const { id } = req.params;
    const { riderId } = req.body;

    if (!riderId) {
      return res.status(400).json({ message: 'Rider ID is required' });
    }

    const rider = await User.findById(riderId);
    if (!rider || rider.role !== 'rider') {
      return res.status(404).json({ message: 'Selected user is not a valid rider' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.rider = rider._id;
    order.status = 'Assigned';
    order.searchStatus = 'Assigned';
    order.assignedAt = new Date();
    order.timeline.push({
      status: 'Assigned',
      timestamp: new Date(),
      note: `Assigned to rider ${rider.name}`
    });

    await order.save();
    
    // Populate rider details for response
    const populatedOrder = await Order.findById(order._id).populate('rider', 'name email phone');
    res.json(populatedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rider accepts an assigned order
export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryType === 'Scheduled' && order.searchStatus === 'None') {
      return res.status(403).json({ message: 'Rider cannot access or accept this scheduled package before its scheduled delivery time.' });
    }

    if (order.rider) {
      if (order.rider.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'This order is not assigned to you' });
      }
    } else {
      order.rider = req.userId;
    }

    order.status = 'Accepted';
    order.searchStatus = 'None';
    order.timeline.push({
      status: 'Accepted',
      timestamp: new Date(),
      note: 'Job accepted by rider'
    });
    await order.save();

    // Mark rider as busy
    await User.findByIdAndUpdate(req.userId, { riderWorkload: 'busy' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rider rejects/declines an assigned order
export const rejectOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryType === 'Scheduled' && order.searchStatus === 'None') {
      return res.status(403).json({ message: 'Rider cannot access or reject this scheduled package before its scheduled delivery time.' });
    }

    if (!order.rider || order.rider.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }

    // Mark rider as available
    await User.findByIdAndUpdate(req.userId, { riderWorkload: 'available' });

    // Track that this rider declined
    if (!order.declinedRiders.includes(req.userId)) {
      order.declinedRiders.push(req.userId);
    }

    order.timeline.push({
      status: 'Pending',
      timestamp: new Date(),
      note: 'Order declined by rider'
    });

    // Automatically check/assign the next nearest rider
    await autoAssignNearestRider(order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer/Admin manual retry search for riders
export const retrySearchOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Reset matching state
    order.declinedRiders = [];
    order.searchStatus = 'Searching';
    order.status = 'Pending';
    order.rider = undefined;
    order.timeline.push({
      status: 'Pending',
      timestamp: new Date(),
      note: 'Retrying search for nearby riders'
    });

    await autoAssignNearestRider(order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Background interval to handle 15-second assignment timeouts
export const startAssignmentTimeoutChecker = () => {
  console.log('🔄 Automatic assignment timeout checker started.');
  setInterval(async () => {
    try {
      const now = new Date();
      const timeoutLimit = 15000; // 15 seconds
      const expirationTime = new Date(now.getTime() - timeoutLimit);

      // Find orders that are currently Assigned and have been assigned longer than 15 seconds
      const ordersToTimeout = await Order.find({
        status: 'Assigned',
        assignedAt: { $lte: expirationTime }
      });

      for (const order of ordersToTimeout) {
        if (order.rider) {
          const riderId = order.rider;
          console.log(`[Auto-Timeout] Order ${order._id} assignment to rider ${riderId} timed out.`);

          // Reset rider workload to available
          await User.findByIdAndUpdate(riderId, { riderWorkload: 'available' });

          // Add rider to declined list
          if (!order.declinedRiders.includes(riderId)) {
            order.declinedRiders.push(riderId);
          }

          order.timeline.push({
            status: 'Pending',
            timestamp: new Date(),
            note: 'Assignment timed out (rider did not respond within 15 seconds)'
          });

          // Search and assign the next nearest rider
          await autoAssignNearestRider(order);
        }
      }

      // Find scheduled orders that are due (within 2 minutes) and transition them to active matching
      const dueScheduledOrders = await Order.find({
        deliveryType: 'Scheduled',
        searchStatus: 'None',
        status: 'Pending',
        scheduledTime: { $lte: new Date(now.getTime() + 120000) }
      });

      for (const order of dueScheduledOrders) {
        order.searchStatus = 'Searching';
        order.timeline.push({
          status: 'Pending',
          timestamp: new Date(),
          note: 'Scheduled delivery time reached. Starting automatic rider dispatch.'
        });
        await order.save();
      }

      // Check for any Pending orders that have not been assigned a rider yet (including Not Found states)
      // prioritize emergency orders at the front of the queue
      const pendingOrders = await Order.find({
        status: 'Pending',
        searchStatus: { $in: ['Searching', 'Not Found'] }
      }).sort({ isEmergency: -1, createdAt: 1 });

      for (const order of pendingOrders) {
        await autoAssignNearestRider(order);
      }
    } catch (err) {
      console.error('Error in assignment timeout checker:', err.message);
    }
  }, 3000); // Check every 3 seconds
};

// Update order status step-by-step
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated from ${previousStatus} to ${status}`
    });

    // Handle financial and workload additions upon delivery completion
    if (status === 'Delivered') {
      const { otp } = req.body;
      if (!otp || otp.toString().trim() !== order.deliveryOTP) {
        return res.status(400).json({ message: 'Invalid Handover OTP. Please ask the customer for the correct 4-digit code.' });
      }

      order.paymentStatus = 'Paid';
      
      // Update rider's account
      if (order.rider) {
        const rider = await User.findById(order.rider);
        if (rider) {
          rider.earnings += order.deliveryFee;
          if (order.paymentMethod === 'COD') {
            rider.collectedCash += order.codAmount;
          }
          rider.riderWorkload = 'available';
          await rider.save();
        }
      }
    }

    // Reset rider workload if order is cancelled
    if (status === 'Cancelled') {
      if (order.rider) {
        await User.findByIdAndUpdate(order.rider, { riderWorkload: 'available' });
      }
    }

    await order.save();
    
    const populated = await Order.findById(order._id)
      .populate('rider', 'name email phone')
      .populate('customerId', 'name email phone');
      
    res.json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin metrics summary
export const getDispatchStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const activeOrders = await Order.countDocuments({ status: { $in: ['Assigned', 'Accepted', 'Arrived at Pickup', 'Picked Up', 'In Transit'] } });
    const completedOrders = await Order.countDocuments({ status: 'Delivered' });
    
    const onlineRiders = await User.countDocuments({ role: 'rider', riderStatus: 'online' });
    const busyRiders = await User.countDocuments({ role: 'rider', riderStatus: 'online', riderWorkload: 'busy' });
    const offlineRiders = await User.countDocuments({ role: 'rider', riderStatus: 'offline' });

    res.json({
      totalOrders,
      pendingOrders,
      activeOrders,
      completedOrders,
      onlineRiders,
      busyRiders,
      offlineRiders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedMockData = async (req, res) => {
  try {
    // Delete existing mock users if email matches seed
    await User.deleteMany({ 
      email: { 
        $in: [
          'rahul@seeded.com', 
          'salim@seeded.com', 
          'joseph@seeded.com', 
          'ramesh@seeded.com'
        ] 
      } 
    });

    // Wipe out any existing orders to keep tracking lists clean of random data
    await Order.deleteMany({});
    
    // Create riders
    const ridersData = [
      {
        name: 'Rider Rahul',
        email: 'rahul@seeded.com',
        password: await import('bcryptjs').then(b => b.default.hash('password123', 10)),
        role: 'rider',
        phone: '+91 98765 43210',
        riderStatus: 'online',
        riderWorkload: 'available',
        currentLocation: { lat: 17.4001, lng: 78.4001 }, // Gachibowli, Hyderabad, TS
        earnings: 120.50,
        collectedCash: 45.00
      },
      {
        name: 'Rider Salim',
        email: 'salim@seeded.com',
        password: await import('bcryptjs').then(b => b.default.hash('password123', 10)),
        role: 'rider',
        phone: '+91 91234 56789',
        riderStatus: 'online',
        riderWorkload: 'available',
        currentLocation: { lat: 17.4325, lng: 78.4071 }, // Jubilee Hills, Hyderabad, TS
        earnings: 75.00,
        collectedCash: 0
      },
      {
        name: 'Rider Joseph',
        email: 'joseph@seeded.com',
        password: await import('bcryptjs').then(b => b.default.hash('password123', 10)),
        role: 'rider',
        phone: '+91 98888 77777',
        riderStatus: 'offline',
        riderWorkload: 'available',
        currentLocation: { lat: 17.4399, lng: 78.4983 }, // Secunderabad, Hyderabad, TS
        earnings: 0,
        collectedCash: 0
      }
    ];

    const seededRiders = await User.create(ridersData);

    // Create a mock customer
    const customer = await User.create({
      name: 'Ramesh (Customer)',
      email: 'ramesh@seeded.com',
      password: await import('bcryptjs').then(b => b.default.hash('password123', 10)),
      role: 'customer',
      phone: '+91 90000 11111'
    });

    res.json({
      message: 'Database seeded successfully with 3 riders and 1 customer. All previous orders cleared.',
      seededRidersCount: seededRiders.length,
      customer: customer.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};