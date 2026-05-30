import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';

// Toggle rider online/offline status
export const toggleStatus = async (req, res) => {
  try {
    const rider = await User.findById(req.userId);
    if (!rider || rider.role !== 'rider') {
      return res.status(403).json({ message: 'Only riders can perform this action' });
    }

    rider.riderStatus = rider.riderStatus === 'online' ? 'offline' : 'online';
    
    // If going offline, reset workload
    if (rider.riderStatus === 'offline') {
      rider.riderWorkload = 'available';
    }

    await rider.save();

    res.json({
      message: `Rider is now ${rider.riderStatus}`,
      riderStatus: rider.riderStatus,
      riderWorkload: rider.riderWorkload
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update rider's simulated location
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Coordinates (lat, lng) are required' });
    }

    const rider = await User.findById(req.userId);
    if (!rider || rider.role !== 'rider') {
      return res.status(403).json({ message: 'Only riders can update location' });
    }

    rider.currentLocation = { lat, lng };
    await rider.save();

    res.json({
      message: 'Location updated successfully',
      currentLocation: rider.currentLocation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get rider statistics and active job
export const getRiderStats = async (req, res) => {
  try {
    const rider = await User.findById(req.userId);
    if (!rider || rider.role !== 'rider') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const activeOrder = await Order.findOne({
      rider: req.userId,
      status: { $nin: ['Delivered', 'Cancelled'] }
    }).populate('customerId');

    res.json({
      riderStatus: rider.riderStatus,
      riderWorkload: rider.riderWorkload,
      earnings: rider.earnings,
      collectedCash: rider.collectedCash,
      currentLocation: rider.currentLocation,
      activeOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only: Get online riders with distance calculations to a pickup point
export const getOnlineRiders = async (req, res) => {
  try {
    const { lat, lng } = req.query; // Pickup coordinates to calculate distances

    const riders = await User.find({
      role: 'rider',
      riderStatus: 'online'
    }).select('-password');

    // If coordinates are provided, calculate distances (mock/simulated or true distance)
    const ridersWithDistance = riders.map(rider => {
      let distance = 0;
      if (lat && lng && rider.currentLocation) {
        // Haversine formula calculation
        const R = 6371; // km
        const dLat = (rider.currentLocation.lat - parseFloat(lat)) * Math.PI / 180;
        const dLng = (rider.currentLocation.lng - parseFloat(lng)) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(parseFloat(lat) * Math.PI / 180) * Math.cos(rider.currentLocation.lat * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
      }
      
      return {
        ...rider.toObject(),
        distanceToPickup: parseFloat(distance.toFixed(2))
      };
    });

    // Sort riders by distance to pickup (nearest first)
    if (lat && lng) {
      ridersWithDistance.sort((a, b) => a.distanceToPickup - b.distanceToPickup);
    }

    res.json(ridersWithDistance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
