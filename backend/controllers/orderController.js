import Order from '../models/OrderModel.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const TELANGANA_LOCATIONS = [
  'Ramnagar, Hyderabad, Telangana',
  'Ramnagara, Hyderabad, Telangana',
  'Ramoji Nagar, Hyderabad, Telangana',
  'Ramoji Film City, Hyderabad, Telangana',
  'Gachibowli, Hyderabad, Telangana',
  'Jubilee Hills, Hyderabad, Telangana',
  'Madhapur, Hyderabad, Telangana',
  'Secunderabad, Hyderabad, Telangana',
  'Banjara Hills, Hyderabad, Telangana',
  'Kukatpally, Hyderabad, Telangana',
  'Begumpet, Hyderabad, Telangana',
  'Uppal, Hyderabad, Telangana',
  'Dilsukhnagar, Hyderabad, Telangana',
  'Hitech City, Hyderabad, Telangana',
  'Charminar, Hyderabad, Telangana',
  'Mehdipatnam, Hyderabad, Telangana',
  'Ameerpet, Hyderabad, Telangana',
  'Koti, Hyderabad, Telangana',
  'Tarnaka, Hyderabad, Telangana',
  'Kondapur, Hyderabad, Telangana',
  'Miyapur, Hyderabad, Telangana',
  'LB Nagar, Hyderabad, Telangana',
  'Himayatnagar, Hyderabad, Telangana',
  'Somajiguda, Hyderabad, Telangana',
  'Nampally, Hyderabad, Telangana',
  'Alwal, Hyderabad, Telangana',
  'Tolichowki, Hyderabad, Telangana',
  'Manikonda, Hyderabad, Telangana',
  'Yousufguda, Hyderabad, Telangana',
  'Attapur, Hyderabad, Telangana',
  'Lingampally, Hyderabad, Telangana',
  'Nizampet, Hyderabad, Telangana',
  'Bowenpally, Hyderabad, Telangana',
  'Nacharam, Hyderabad, Telangana',
  'Malkajgiri, Hyderabad, Telangana',
  'Amberpet, Hyderabad, Telangana',
  'Khairatabad, Hyderabad, Telangana',
  'Warangal, Telangana',
  'Nizamabad, Telangana',
  'Karimnagar, Telangana',
  'Khammam, Telangana',
  'Ramagundam, Telangana',
  'Mahbubnagar, Telangana',
  'Nalgonda, Telangana',
  'Adilabad, Telangana',
  'Suryapet, Telangana',
  'Miryalaguda, Telangana',
  'Siddipet, Telangana'
];

// Helper to simulate coordinates distance and pricing deterministically based on addresses
const calculateOrderMetrics = (pickupAddress, deliveryAddress) => {
  const combined = ((pickupAddress || '') + (deliveryAddress || '')).trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = (Math.abs(hash) % 1000) / 1000;

  // Generate a distance between 1.5km and 12km based on the seed
  const distance = parseFloat((seed * (12 - 1.5) + 1.5).toFixed(1));
  // Flat fee $3.00 + $1.50 per km
  const deliveryFee = parseFloat((3.0 + distance * 1.5).toFixed(2));
  // ETA: 8 minutes prep + 3 minutes per km
  const eta = Math.round(8 + distance * 3);

  return { distance, deliveryFee, eta };
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      pickupAddress,
      deliveryAddress,
      items,
      paymentMethod,
      pickupPhone,
      deliveryPhone
    } = req.body;

    if (!customerName || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({ message: 'Customer name, pickup address, and delivery address are required' });
    }

    // Validation and normalization of Telangana Locations
    const matchedPickup = TELANGANA_LOCATIONS.find(
      (loc) => loc.toLowerCase() === pickupAddress.trim().toLowerCase()
    );
    const matchedDelivery = TELANGANA_LOCATIONS.find(
      (loc) => loc.toLowerCase() === deliveryAddress.trim().toLowerCase()
    );

    if (!matchedPickup) {
      return res.status(400).json({ message: `Pickup Address "${pickupAddress}" is not a valid Telangana location.` });
    }
    if (!matchedDelivery) {
      return res.status(400).json({ message: `Delivery Address "${deliveryAddress}" is not a valid Telangana location.` });
    }

    // Determine role of creator
    const creator = await User.findById(req.userId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator user not found' });
    }

    const { distance, deliveryFee, eta } = calculateOrderMetrics(matchedPickup, matchedDelivery);

    // Parse items and calculate total amount
    const parsedItems = items && items.length > 0 ? items : [{ name: 'Standard Package', quantity: 1, price: 15.00 }];
    const totalAmount = parseFloat(parsedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));

    const isCod = paymentMethod === 'COD';
    const codAmount = isCod ? parseFloat((totalAmount + deliveryFee).toFixed(2)) : 0;

    const orderData = {
      customerName,
      pickupAddress: matchedPickup,
      deliveryAddress: matchedDelivery,
      items: parsedItems,
      totalAmount,
      pickupPhone: pickupPhone || '',
      deliveryPhone: deliveryPhone || '',
      distance,
      deliveryFee,
      eta,
      paymentMethod: paymentMethod || 'Prepaid',
      codAmount,
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order created successfully'
        }
      ]
    };

    orderData.customerId = creator._id;

    const order = await Order.create(orderData);
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
            // Riders see their assigned jobs or orders they took
            filters.$or = [
              { rider: user._id },
              { status: 'Pending' } // Riders can view pending orders to see availability
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

    if (order.rider) {
      if (order.rider.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'This order is not assigned to you' });
      }
    } else {
      order.rider = req.userId;
    }

    order.status = 'Accepted';
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

    if (order.rider.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }

    order.status = 'Pending';
    order.rider = undefined;
    order.timeline.push({
      status: 'Pending',
      timestamp: new Date(),
      note: 'Order declined by rider'
    });
    await order.save();

    // Mark rider as available
    await User.findByIdAndUpdate(req.userId, { riderWorkload: 'available' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
        currentLocation: { lat: 17.4483, lng: 78.3741 }, // Gachibowli, Hyderabad, TS
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