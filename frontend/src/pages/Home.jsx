import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Simple SVG Icons
const Icons = {
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Box: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 3.73A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Truck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="11" x="2" y="7" rx="2" ry="2"/><path d="M16 21h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-1.66-1.97L16 12.03V7"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="18.5" r="2.5"/></svg>
  ),
  Dollar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  )
};

// Helper to calculate coordinates distance and pricing based on addresses or real coordinates (mirrors backend)
const estimateDeliveryMetrics = (pickup, delivery, pickupLat, pickupLng, deliveryLat, deliveryLng, isEmergency = false) => {
  if (!pickup || !delivery) return null;
  
  let distance;
  if (pickupLat && pickupLng && deliveryLat && deliveryLng) {
    const R = 6371; // km
    const dLat = (deliveryLat - pickupLat) * Math.PI / 180;
    const dLng = (deliveryLng - pickupLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupLat * Math.PI / 180) * Math.cos(deliveryLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    distance = parseFloat((R * c).toFixed(1));
  } else {
    // Fallback to hash-based simulation
    const combined = (pickup + delivery).trim().toLowerCase();
    if (combined.length < 5) return null;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = (Math.abs(hash) % 1000) / 1000;
    distance = parseFloat((seed * (12 - 1.5) + 1.5).toFixed(1));
  }

  let deliveryFee = parseFloat((3.0 + distance * 1.5).toFixed(2));
  let eta = Math.round(8 + distance * 3);

  if (isEmergency) {
    deliveryFee = parseFloat((deliveryFee + 5.0).toFixed(2));
    eta = Math.max(5, Math.round(eta * 0.7));
  }

  return { distance, deliveryFee, eta };
};

const getStatusStepIndex = (status) => {
  switch (status) {
    case 'Pending': return 0;
    case 'Assigned':
    case 'Accepted': return 1;
    case 'Arrived at Pickup':
    case 'Picked Up':
    case 'In Transit': return 2;
    case 'Delivered': return 3;
    default: return -1;
  }
};

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

function Home({ onBackToHome }) {
  const { user, token, logout, setUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [onlineRiders, setOnlineRiders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    onlineRiders: 0,
    busyRiders: 0,
    offlineRiders: 0
  });

  // Rider Dashboard state
  const [riderDashboard, setRiderDashboard] = useState({
    riderStatus: 'offline',
    riderWorkload: 'available',
    earnings: 0,
    collectedCash: 0,
    activeOrder: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [riderOtp, setRiderOtp] = useState('');

  // Form State for Booking
  const [formData, setFormData] = useState({
    customerName: '',
    pickupAddress: '',
    deliveryAddress: '',
    pickupPhone: '',
    deliveryPhone: '',
    paymentMethod: 'Prepaid',
    pickupLat: null,
    pickupLng: null,
    deliveryLat: null,
    deliveryLng: null,
    deliveryType: 'Instant',
    scheduledTime: '',
    isEmergency: false
  });
  const [pickupTimeout, setPickupTimeout] = useState(null);
  const [deliveryTimeout, setDeliveryTimeout] = useState(null);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [items, setItems] = useState([{ name: 'Standard Package', quantity: 1, price: 15.00 }]);
  const [expandedTimelineId, setExpandedTimelineId] = useState(null);

  // Dispatch allocation state
  const [dispatchTargetId, setDispatchTargetId] = useState(null);
  const [dispatchRiderList, setDispatchRiderList] = useState([]);

  // Autocomplete suggestions state
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);

  const pickupRef = useRef(null);
  const deliveryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setShowPickupDropdown(false);
      }
      if (deliveryRef.current && !deliveryRef.current.contains(event.target)) {
        setShowDeliveryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => {
      fetchInitialData();
    }, 5000);
    return () => clearInterval(interval);
  }, [token, user?.role]);

  useEffect(() => {
    if (user?.role === 'rider' && riderDashboard.riderStatus === 'online') {
      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put(`${import.meta.env.VITE_API_URL}/riders/location`, { lat: latitude, lng: longitude }, config);
              } catch (e) {
                console.error("Error sending location to server:", e);
              }
            },
            (err) => console.warn("Error getting geolocation:", err)
          );
        }
      };
      
      updateLocation();
      const interval = setInterval(updateLocation, 15000);
      return () => clearInterval(interval);
    }
  }, [token, user?.role, riderDashboard.riderStatus]);

  const fetchInitialData = () => {
    if (!token) return;
    setError('');
    
    if (user?.role === 'admin') {
      fetchOrders();
      fetchDispatchStats();
      if (!dispatchTargetId) {
        fetchOnlineRiders();
      }
    } else if (user?.role === 'rider') {
      fetchRiderDashboard();
      fetchOrders(); // Retrieve candidate list or assigned list
    } else {
      // Customer or Vendor
      fetchOrders();
    }
  };

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, config);
      setOrders(res.data);

      // Refresh online riders relative to the active order if the assignment panel is open
      if (dispatchTargetId) {
        const activeOrder = res.data.find(o => o._id === dispatchTargetId);
        if (activeOrder) {
          const coords = activeOrder.pickupLocation && activeOrder.pickupLocation.lat
            ? activeOrder.pickupLocation
            : getAddressCoordinates(activeOrder.pickupAddress);
          fetchOnlineRiders(coords.lat, coords.lng);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders list');
    }
  };

  const fetchDispatchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/stats`, config);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOnlineRiders = async (lat = 17.3850, lng = 78.4867) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/riders/online?lat=${lat}&lng=${lng}`, config);
      setOnlineRiders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRiderDashboard = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/riders/stats`, config);
      setRiderDashboard(res.data);
      
      // Update global context user details if stats changed
      if (user) {
        setUser({
          ...user,
          riderStatus: res.data.riderStatus,
          riderWorkload: res.data.riderWorkload,
          earnings: res.data.earnings,
          collectedCash: res.data.collectedCash
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Seeder
  const handleSeedMockData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/seed-mock-data`);
      setSuccess(res.data.message);
      fetchInitialData();
    } catch (err) {
      setError('Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  // Create Order
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: val,
      ...(name === 'pickupAddress' ? { pickupLat: null, pickupLng: null } : {}),
      ...(name === 'deliveryAddress' ? { deliveryLat: null, deliveryLng: null } : {})
    }));

    if (name === 'pickupAddress') {
      if (pickupTimeout) clearTimeout(pickupTimeout);
      if (value.trim().length >= 3) {
        setPickupLoading(true);
        const timeout = setTimeout(async () => {
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&viewbox=78.2,17.2,78.6,17.6&bounded=1`);
            setPickupSuggestions(res.data);
            setShowPickupDropdown(true);
          } catch (err) {
            console.error(err);
          } finally {
            setPickupLoading(false);
          }
        }, 500);
        setPickupTimeout(timeout);
      } else {
        setPickupSuggestions([]);
        setShowPickupDropdown(false);
      }
    }

    if (name === 'deliveryAddress') {
      if (deliveryTimeout) clearTimeout(deliveryTimeout);
      if (value.trim().length >= 3) {
        setDeliveryLoading(true);
        const timeout = setTimeout(async () => {
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&viewbox=78.2,17.2,78.6,17.6&bounded=1`);
            setDeliverySuggestions(res.data);
            setShowDeliveryDropdown(true);
          } catch (err) {
            console.error(err);
          } finally {
            setDeliveryLoading(false);
          }
        }, 500);
        setDeliveryTimeout(timeout);
      } else {
        setDeliverySuggestions([]);
        setShowDeliveryDropdown(false);
      }
    }
  };

  const handleSelectPickup = (item) => {
    setFormData(prev => ({
      ...prev,
      pickupAddress: item.display_name,
      pickupLat: parseFloat(item.lat),
      pickupLng: parseFloat(item.lon)
    }));
    setShowPickupDropdown(false);
  };

  const handleSelectDelivery = (item) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: item.display_name,
      deliveryLat: parseFloat(item.lat),
      deliveryLng: parseFloat(item.lon)
    }));
    setShowDeliveryDropdown(false);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.pickupAddress || !formData.deliveryAddress) {
      setError('Please fill in pickup & delivery addresses and customer name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let pickupLat = formData.pickupLat;
      let pickupLng = formData.pickupLng;
      if (!pickupLat || !pickupLng) {
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.pickupAddress)}&format=json&limit=1&viewbox=78.2,17.2,78.6,17.6&bounded=1`);
          if (res.data && res.data.length > 0) {
            pickupLat = parseFloat(res.data[0].lat);
            pickupLng = parseFloat(res.data[0].lon);
          } else {
            setError(`Could not locate Pickup Address "${formData.pickupAddress}" on the map. Please type a valid location.`);
            setLoading(false);
            return;
          }
        } catch (err) {
          setError('Geocoding pickup address failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      let deliveryLat = formData.deliveryLat;
      let deliveryLng = formData.deliveryLng;
      if (!deliveryLat || !deliveryLng) {
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.deliveryAddress)}&format=json&limit=1&viewbox=78.2,17.2,78.6,17.6&bounded=1`);
          if (res.data && res.data.length > 0) {
            deliveryLat = parseFloat(res.data[0].lat);
            deliveryLng = parseFloat(res.data[0].lon);
          } else {
            setError(`Could not locate Delivery Address "${formData.deliveryAddress}" on the map. Please type a valid location.`);
            setLoading(false);
            return;
          }
        } catch (err) {
          setError('Geocoding delivery address failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        pickupLocation: { lat: pickupLat, lng: pickupLng },
        deliveryLocation: { lat: deliveryLat, lng: deliveryLng },
        items
      };

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, payload, config);
      
      setSuccess('Order created and queued for dispatch!');
      setFormData({
        customerName: '',
        pickupAddress: '',
        deliveryAddress: '',
        pickupPhone: '',
        deliveryPhone: '',
        paymentMethod: 'Prepaid',
        pickupLat: null,
        pickupLng: null,
        deliveryLat: null,
        deliveryLng: null,
        deliveryType: 'Instant',
        scheduledTime: '',
        isEmergency: false
      });

      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book order');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Rider Online status
  const handleToggleDuty = async () => {
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/riders/toggle`, {}, config);
      setSuccess(res.data.message);
      fetchRiderDashboard();
      fetchOrders();
    } catch (err) {
      setError('Failed to update duty status');
    }
  };

  // Open Rider dispatch select panel
  const handleOpenAssign = (order) => {
    setDispatchTargetId(order._id);
    const coords = order.pickupLocation && order.pickupLocation.lat
      ? order.pickupLocation
      : getAddressCoordinates(order.pickupAddress);
    fetchOnlineRiders(coords.lat, coords.lng);
  };

  // Assign Rider
  const handleAssignRider = async (orderId, riderId) => {
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/assign`,
        { riderId },
        config
      );
      setSuccess('Rider assigned successfully! Awaiting rider acceptance.');
      setDispatchTargetId(null);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign rider');
    }
  };

  // Accept Order (Rider)
  const handleRiderAccept = async (orderId) => {
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/accept`, {}, config);
      setSuccess('Job accepted! Proceed to pickup location.');
      fetchRiderDashboard();
      fetchOrders();
    } catch (err) {
      setError('Failed to accept job');
    }
  };

  // Decline Order (Rider)
  const handleRiderReject = async (orderId) => {
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/reject`, {}, config);
      setSuccess('Job offer declined.');
      fetchRiderDashboard();
      fetchOrders();
    } catch (err) {
      setError('Failed to decline job');
    }
  };

  // Advance Order Status (Rider/Admin)
  const handleAdvanceStatus = async (orderId, nextStatus, extraPayload = {}) => {
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: nextStatus, ...extraPayload },
        config
      );
      if (user?.role === 'rider') {
        fetchRiderDashboard();
        setRiderOtp(''); // reset input after successful transit verification
      }
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update delivery milestone');
    }
  };

  // Delete Order (Customer/Admin)
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order permanently?')) return;
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, config);
      setSuccess('Order removed.');
      fetchInitialData();
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  // Retry Search for Courier
  const handleRetrySearch = async (orderId) => {
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/retry-search`, {}, config);
      setSuccess('Search restarted successfully!');
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retry search');
    }
  };

  const getStatusBadge = (orderOrStatus) => {
    if (!orderOrStatus) return null;
    
    // If a string is passed, handle it directly
    if (typeof orderOrStatus === 'string') {
      const status = orderOrStatus;
      switch (status) {
        case 'Pending': return <span className="badge badge-pending">Pending</span>;
        case 'Assigned': return <span className="badge badge-assigned">Assigned</span>;
        case 'Accepted': return <span className="badge badge-accepted">Accepted</span>;
        case 'Arrived at Pickup': return <span className="badge badge-transit">Arriving Pickup</span>;
        case 'Picked Up': return <span className="badge badge-transit">Picked Up</span>;
        case 'In Transit': return <span className="badge badge-transit">In Transit</span>;
        case 'Delivered': return <span className="badge badge-delivered">Delivered</span>;
        case 'Cancelled': return <span className="badge badge-cancelled">Cancelled</span>;
        default: return <span className="badge">{status}</span>;
      }
    }
    
    // If an order object is passed, handle searchStatus logic
    const order = orderOrStatus;
    const status = order.status;
    if (status === 'Pending') {
      if (order.searchStatus === 'Searching') {
        return (
          <span className="badge badge-pending" style={{ background: 'linear-gradient(135deg, #f59e0b, #3b82f6)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
            Searching
          </span>
        );
      }
      if (order.searchStatus === 'Not Found') {
        return <span className="badge badge-cancelled" style={{ background: '#ef4444' }}>No Rider Available</span>;
      }
      return <span className="badge badge-pending">Pending</span>;
    }
    
    switch (status) {
      case 'Assigned': return <span className="badge badge-assigned">Assigned</span>;
      case 'Accepted': return <span className="badge badge-accepted">Accepted</span>;
      case 'Arrived at Pickup': return <span className="badge badge-transit">Arriving Pickup</span>;
      case 'Picked Up': return <span className="badge badge-transit">Picked Up</span>;
      case 'In Transit': return <span className="badge badge-transit">In Transit</span>;
      case 'Delivered': return <span className="badge badge-delivered">Delivered</span>;
      case 'Cancelled': return <span className="badge badge-cancelled">Cancelled</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, #0c1220 0%, #060911 90%)', padding: '24px' }}>
      
      {/* Top Banner Navigation */}
      <header className="glass-panel responsive-header" style={{ marginBottom: '24px' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: onBackToHome ? 'pointer' : 'default' 
          }} 
          onClick={onBackToHome || undefined}
        >
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)' }}>
            <Icons.Truck />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HyperLocal</h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', tracking: '0.1em' }}>Dispatcher Node</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="glass-panel" style={{ padding: '6px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', flex: 1, justifyContent: 'center' }}>
            {user?.role === 'rider' ? (
              <span className={`pulse-dot ${user?.riderStatus === 'online' ? (user?.riderWorkload === 'busy' ? 'pulse-dot-busy' : 'pulse-dot-online') : 'pulse-dot-offline'}`}></span>
            ) : (
              <div style={{ background: '#38bdf8', width: '8px', height: '8px', borderRadius: '50%' }}></div>
            )}
            <span style={{ fontWeight: 600 }}>{user?.name}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'capitalize', borderLeft: '1px solid var(--border-color)', paddingLeft: '8px' }}>{user?.role}</span>
          </div>

          {onBackToHome && (
            <button onClick={onBackToHome} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Home
            </button>
          )}

          <button onClick={logout} className="btn-danger" style={{ padding: '8px 16px', fontSize: '0.85rem', boxShadow: 'none' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Alert Messaging System */}
      {error && (
        <div className="badge-cancelled" style={{ padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500, width: '100%', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚠️ {error}</span>
        </div>
      )}
      {success && (
        <div className="badge-delivered" style={{ padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500, width: '100%', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅ {success}</span>
        </div>
      )}

      {/* MAIN CONTAINER PANELS BY ROLE */}

      {/* ROLE: ADMIN (DISPATCH CONTROL ROOM) */}
      {user?.role === 'admin' && (
        <div>
          {/* Key Dispatch Metrics Grid */}
          <div className="metrics-row">
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Online Fleet Riders</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{stats.onlineRiders} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {stats.onlineRiders + stats.offlineRiders} total</span></span>
            </div>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending Dispatch Queue</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>{stats.pendingOrders}</span>
            </div>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active In-Transit Jobs</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.activeOrders}</span>
            </div>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Delivered Cycles</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7' }}>{stats.completedOrders}</span>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Left: Dispatch Queue list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icons.Box /> Order Operations Queue ({orders.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map((order) => (
                    <div key={order._id} className="glass-panel" style={{ padding: '20px', borderLeft: order.status === 'Pending' ? '4px solid var(--warning)' : '4px solid var(--primary)', background: 'rgba(15, 23, 42, 0.45)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{order.customerName}</h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order ID: #{order._id.substring(18)}</span>
                        </div>
                        {getStatusBadge(order)}
                      </div>

                      <div className="responsive-grid-2" style={{ gap: '10px', fontSize: '0.85rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Pickup: </strong>
                          {order.pickupAddress}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Delivery: </strong>
                          {order.deliveryAddress}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Items: </strong>
                          {order.items?.map(it => `${it.name} (x${it.quantity})`).join(', ') || 'Package'}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Fare/COD: </strong>
                          ${order.totalAmount.toFixed(2)} | {order.paymentMethod === 'COD' ? `COD ($${order.codAmount.toFixed(2)})` : 'Prepaid'}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Stats: </strong>
                          {order.distance} km | {order.eta} mins ETA | Delivery Fee: ${order.deliveryFee}
                        </div>
                        {order.status === 'Pending' && (
                          <div>
                            <strong style={{ color: 'var(--text-muted)' }}>Auto Match: </strong>
                            <span style={{ color: order.searchStatus === 'Searching' ? '#38bdf8' : '#ef4444', fontWeight: 600 }}>
                              {order.searchStatus === 'Searching' ? '🔍 Searching nearby...' : '⚠️ No Rider Available'}
                            </span>
                          </div>
                        )}
                        {order.status === 'Assigned' && order.rider && (
                          <div>
                            <strong style={{ color: 'var(--warning)' }}>Auto Match: </strong>
                            <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                              ⏳ Assigned to {order.rider.name} (Awaiting Acceptance)
                            </span>
                          </div>
                        )}
                        {order.rider && (
                          <div>
                            <strong style={{ color: 'var(--primary)' }}>Courier: </strong>
                            {order.rider.name}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icons.Clock /> {new Date(order.createdAt).toLocaleString()}
                        </span>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          {order.status === 'Pending' && (
                            <button onClick={() => handleOpenAssign(order)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                              Assign Rider
                            </button>
                          )}

                          <button onClick={() => handleDeleteOrder(order._id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>

                      {/* Display inline rider assignment panel */}
                      {dispatchTargetId === order._id && (
                        <div className="glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px dashed var(--primary)' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary)' }}>Select Active Courier:</h4>
                          {onlineRiders.length === 0 ? (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No online couriers found. Open rider panel and set duty switch to ON.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {onlineRiders.map((rider) => (
                                <div key={rider._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                  <div>
                                    <strong>{rider.name}</strong> <span style={{ color: 'var(--text-muted)' }}>({rider.riderWorkload})</span>
                                    <div><span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{rider.distanceToPickup} km from pickup store</span></div>
                                  </div>
                                  <button onClick={() => handleAssignRider(order._id, rider._id)} disabled={rider.riderWorkload === 'busy'} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                                    Assign Job
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No dispatch orders currently booked. Seed mock data to start.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Courier Fleet monitor */}
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icons.Users /> Courier Fleet Status
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {onlineRiders.map((rider) => (
                  <div key={rider._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{rider.name}</span>
                      <span className={`pulse-dot ${rider.riderWorkload === 'busy' ? 'pulse-dot-busy' : 'pulse-dot-online'}`}></span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <div>Status: <span style={{ color: rider.riderWorkload === 'busy' ? 'var(--warning)' : 'var(--success)' }}>{rider.riderWorkload.toUpperCase()}</span></div>
                      <div>Earnings: ${rider.earnings.toFixed(2)}</div>
                      <div>Position: [{rider.currentLocation.lat.toFixed(4)}, {rider.currentLocation.lng.toFixed(4)}]</div>
                    </div>
                  </div>
                ))}
                {onlineRiders.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '16px' }}>No riders online at this time.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROLE: RIDER (MOBILE-FRIENDLY DISPATCH JOB APP) */}
      {user?.role === 'rider' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Duty Switch Panel */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: riderDashboard.riderStatus === 'online' ? '4px solid var(--success)' : '4px solid var(--text-muted)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Duty State Status</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: riderDashboard.riderStatus === 'online' ? 'var(--success)' : 'var(--text-muted)' }}>
                {riderDashboard.riderStatus === 'online' ? 'On Active Duty' : 'Off Duty'}
              </h2>
            </div>
            <button
              onClick={handleToggleDuty}
              className={riderDashboard.riderStatus === 'online' ? 'btn-danger' : 'btn-success'}
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              {riderDashboard.riderStatus === 'online' ? 'Go Off Duty' : 'Go On Duty'}
            </button>
          </div>

          {/* Wallet and Earnings stats */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '16px 32px', textAlign: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Duty Wallet Balance</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>${riderDashboard.earnings.toFixed(2)}</h3>
            </div>
          </div>

          {/* Core Job Board */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px' }}>Current Dispatch Offer</h2>

            {riderDashboard.riderStatus === 'offline' ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Go ON DUTY to receive nearby delivery opportunities.</div>
            ) : riderDashboard.activeOrder ? (
              <div>
                {/* Active job layout */}
                {riderDashboard.activeOrder.status === 'Assigned' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="badge-warning" style={{ padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>🚨 NEW ASSIGNED ORDER ASSIGNMENT OFFER!</div>
                    
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <div style={{ marginBottom: '8px' }}><strong>Store Pickup:</strong> {riderDashboard.activeOrder.pickupAddress}</div>
                      <div style={{ marginBottom: '8px' }}><strong>Customer Delivery:</strong> {riderDashboard.activeOrder.deliveryAddress}</div>
                      <div style={{ marginBottom: '8px' }}><strong>Payout / Delivery Fee:</strong> ${riderDashboard.activeOrder.deliveryFee}</div>
                      <div style={{ marginBottom: '8px' }}><strong>Distance:</strong> {riderDashboard.activeOrder.distance} km</div>
                      <div style={{ marginBottom: '8px' }}><strong>Estimated Delivery Time (ETA):</strong> {riderDashboard.activeOrder.eta} mins</div>
                      <div><strong>Payment Mode:</strong> {riderDashboard.activeOrder.paymentMethod} {riderDashboard.activeOrder.paymentMethod === 'COD' && `(Collect $${riderDashboard.activeOrder.codAmount.toFixed(2)})`}</div>
                    </div>

                    <div className="responsive-grid-2" style={{ gap: '12px' }}>
                      <button onClick={() => handleRiderAccept(riderDashboard.activeOrder._id)} className="btn-success">Accept Job</button>
                      <button onClick={() => handleRiderReject(riderDashboard.activeOrder._id)} className="btn-danger">Decline Offer</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {riderDashboard.activeOrder.isEmergency && (
                      <div className="emergency-flash-banner" style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                        border: '1px solid rgba(244, 63, 94, 0.4)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)',
                        animation: 'flash-alert 1.5s infinite alternate'
                      }}>
                        🚨 EMERGENCY DISPATCH: URGENT MEDICINE/ITEM. PLEASE DELIVER ASAP!
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Active Job in Progress</span>
                      {getStatusBadge(riderDashboard.activeOrder)}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <p style={{ marginBottom: '8px' }}><strong>Customer:</strong> {riderDashboard.activeOrder.customerName}</p>
                      <p style={{ marginBottom: '8px' }}><strong>Store Pickup:</strong> {riderDashboard.activeOrder.pickupAddress}</p>
                      <p style={{ marginBottom: '8px' }}><strong>Customer Address:</strong> {riderDashboard.activeOrder.deliveryAddress}</p>
                      <p style={{ marginBottom: '8px' }}><strong>Pickup Contact:</strong> {riderDashboard.activeOrder.pickupPhone || 'None'}</p>
                      <p style={{ marginBottom: '8px' }}><strong>Delivery Contact:</strong> {riderDashboard.activeOrder.deliveryPhone || 'None'}</p>
                      <p style={{ marginBottom: '8px' }}><strong>Package Items:</strong> {riderDashboard.activeOrder.items?.map(it => `${it.name} (x${it.quantity})`).join(', ')}</p>
                      <p style={{ marginBottom: '8px' }}><strong>Estimated Delivery Time (ETA):</strong> {riderDashboard.activeOrder.eta} mins</p>
                      <p><strong>Total Bill:</strong> ${riderDashboard.activeOrder.totalAmount.toFixed(2)} | <strong>Delivery Fee:</strong> ${riderDashboard.activeOrder.deliveryFee}</p>
                    </div>

                    {riderDashboard.activeOrder.paymentMethod === 'COD' && (
                      <div className="badge-warning" style={{ padding: '14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, border: '1px dashed var(--warning)', display: 'block', textAlign: 'center' }}>
                        ⚠️ CASH ON DELIVERY ORDER: Collect ${riderDashboard.activeOrder.codAmount.toFixed(2)} in cash from the customer upon handover!
                      </div>
                    )}

                    {/* Step transitions button */}
                    {riderDashboard.activeOrder.status === 'Accepted' && (
                      <button onClick={() => handleAdvanceStatus(riderDashboard.activeOrder._id, 'Arrived at Pickup')} className="btn-primary" style={{ padding: '14px' }}>
                        Arrived at Pickup Store
                      </button>
                    )}
                    {riderDashboard.activeOrder.status === 'Arrived at Pickup' && (
                      <button onClick={() => handleAdvanceStatus(riderDashboard.activeOrder._id, 'Picked Up')} className="btn-primary" style={{ padding: '14px' }}>
                        Confirm Items Picked Up
                      </button>
                    )}
                    {riderDashboard.activeOrder.status === 'Picked Up' && (
                      <button onClick={() => handleAdvanceStatus(riderDashboard.activeOrder._id, 'In Transit')} className="btn-primary" style={{ padding: '14px' }}>
                        Start Transit to Customer
                      </button>
                    )}
                    {riderDashboard.activeOrder.status === 'In Transit' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Enter Customer Handover OTP</label>
                        <input
                          type="text"
                          placeholder="e.g. 4-digit code"
                          className="glass-input"
                          maxLength={6}
                          value={riderOtp}
                          onChange={(e) => setRiderOtp(e.target.value)}
                          style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 800 }}
                        />
                        <button 
                          onClick={() => {
                            handleAdvanceStatus(riderDashboard.activeOrder._id, 'Delivered', { otp: riderOtp });
                          }} 
                          className="btn-success" 
                          style={{ padding: '14px', marginTop: '4px' }}
                          disabled={!riderOtp || riderOtp.trim().length === 0}
                        >
                          Verify OTP & Complete Handover
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--primary)' }}>Available Jobs For Pickup ({orders.filter(o => o.status === 'Pending').length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.filter(o => o.status === 'Pending').map((order) => (
                    <div key={order._id} className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.45)', borderLeft: order.isEmergency ? '4px solid var(--danger)' : '4px solid var(--primary)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '0.92rem' }}>Order #{order._id.substring(18)}</strong>
                          {order.isEmergency && <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, color: '#f43f5e', background: 'rgba(244,63,94,0.12)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(244,63,94,0.2)', marginLeft: '6px', verticalAlign: 'middle' }}>🚨 URGENT</span>}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Payout: <span style={{ color: 'var(--success)', fontWeight: 700 }}>${order.deliveryFee.toFixed(2)}</span></div>
                        </div>
                        <button 
                          onClick={() => handleRiderAccept(order._id)}
                          className="btn-success"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                        >
                          Accept Fare
                        </button>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                        <div>📍 <strong style={{ color: 'var(--text-muted)' }}>Pickup:</strong> {order.pickupAddress}</div>
                        <div>🏁 <strong style={{ color: 'var(--text-muted)' }}>Delivery:</strong> {order.deliveryAddress}</div>
                        <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                          <span>📏 {order.distance} km</span>
                          <span>⏱️ {order.eta} mins ETA</span>
                          <span>💳 {order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'Pending').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 1.5s linear infinite' }}></div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Waiting for next dispatch assignment... Keep app open.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ROLE: CUSTOMER (BOOKING CONSOLE) */}
      {user?.role === 'customer' && (
        <div className="dashboard-grid">
          
          {/* Left Column: Order Booking Wizard */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icons.Plus /> Dispatch Booking Wizard
            </h2>

            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="responsive-grid-2" style={{ gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Customer Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    className="glass-input"
                    placeholder="e.g. Arti Sharma"
                    value={formData.customerName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Payment Scheme</label>
                  <select
                    name="paymentMethod"
                    className="glass-select"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
                  >
                    <option value="Prepaid">Prepaid (Card/UPI)</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>
              </div>

              <div className="responsive-grid-2" style={{ gap: '14px' }}>
                <div ref={pickupRef} style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Pickup Point Address</label>
                  <input
                    type="text"
                    name="pickupAddress"
                    className="glass-input"
                    placeholder="e.g. Gachibowli, Hyderabad, Telangana"
                    value={formData.pickupAddress}
                    onChange={handleFormChange}
                    onFocus={() => {
                      if (formData.pickupAddress.trim().length >= 3) {
                        setShowPickupDropdown(true);
                      }
                    }}
                    required
                    autoComplete="off"
                  />
                  {pickupLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '34px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                      Searching...
                    </div>
                  )}
                  {showPickupDropdown && pickupSuggestions.length > 0 && (
                    <div className="glass-panel" style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 100,
                      background: 'rgba(15, 22, 36, 0.98)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      marginTop: '4px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}>
                      {pickupSuggestions.map((loc, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectPickup(loc)}
                          style={{
                            padding: '10px 14px',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            color: 'var(--text-main)',
                            borderBottom: idx < pickupSuggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(14, 165, 233, 0.15)';
                            e.target.style.color = 'var(--primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--text-main)';
                          }}
                        >
                          {loc.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div ref={deliveryRef} style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Delivery Destination Address</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    className="glass-input"
                    placeholder="e.g. Jubilee Hills, Hyderabad, Telangana"
                    value={formData.deliveryAddress}
                    onChange={handleFormChange}
                    onFocus={() => {
                      if (formData.deliveryAddress.trim().length >= 3) {
                        setShowDeliveryDropdown(true);
                      }
                    }}
                    required
                    autoComplete="off"
                  />
                  {deliveryLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '34px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                      Searching...
                    </div>
                  )}
                  {showDeliveryDropdown && deliverySuggestions.length > 0 && (
                    <div className="glass-panel" style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 100,
                      background: 'rgba(15, 22, 36, 0.98)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      marginTop: '4px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}>
                      {deliverySuggestions.map((loc, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectDelivery(loc)}
                          style={{
                            padding: '10px 14px',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            color: 'var(--text-main)',
                            borderBottom: idx < deliverySuggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(14, 165, 233, 0.15)';
                            e.target.style.color = 'var(--primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--text-main)';
                          }}
                        >
                          {loc.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="responsive-grid-2" style={{ gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Pickup Contact Number</label>
                  <input
                    type="text"
                    name="pickupPhone"
                    className="glass-input"
                    placeholder="+91 88888 77777"
                    value={formData.pickupPhone}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Delivery Contact Number</label>
                  <input
                    type="text"
                    name="deliveryPhone"
                    className="glass-input"
                    placeholder="+91 99999 00000"
                    value={formData.deliveryPhone}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Separate Section: Priority Options */}
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>Dispatch Mode</h3>
                
                <div className="responsive-grid-2" style={{ gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Choose Delivery Speed</label>
                    <select
                      name="deliveryType"
                      className="glass-select"
                      value={formData.deliveryType}
                      onChange={handleFormChange}
                    >
                      <option value="Instant">⚡ Instant Delivery</option>
                      <option value="Scheduled">📅 Scheduled Delivery</option>
                    </select>
                  </div>
                  {formData.deliveryType === 'Scheduled' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Select Booking Time</label>
                      <input
                        type="datetime-local"
                        name="scheduledTime"
                        className="glass-input"
                        value={formData.scheduledTime}
                        onChange={handleFormChange}
                        min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} // min is 1 minute from now
                        required={formData.deliveryType === 'Scheduled'}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(244, 63, 94, 0.04)', padding: '12px 14px', borderRadius: '8px', border: '1px dashed rgba(244, 63, 94, 0.25)', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="isEmergency"
                    name="isEmergency"
                    checked={formData.isEmergency}
                    onChange={handleFormChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--danger)' }}
                  />
                  <label htmlFor="isEmergency" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', cursor: 'pointer', userSelect: 'none' }}>
                    🚨 Emergency Delivery Mode (Priority Medicines or Urgent Items)
                  </label>
                </div>
              </div>

              {/* Dynamic Route Estimation Preview */}
              {(() => {
                const estimate = estimateDeliveryMetrics(
                  formData.pickupAddress,
                  formData.deliveryAddress,
                  formData.pickupLat,
                  formData.pickupLng,
                  formData.deliveryLat,
                  formData.deliveryLng,
                  formData.isEmergency
                );
                if (!estimate) return null;
                return (
                  <div className="glass-panel" style={{ padding: '18px', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.25)', boxShadow: '0 0 15px rgba(14, 165, 233, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(14, 165, 233, 0.15)', paddingBottom: '8px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                          <Icons.Activity />
                        </span>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Live Route Estimation</h4>
                      </div>
                      {formData.isEmergency && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f43f5e', background: 'rgba(244,63,94,0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(244,63,94,0.2)' }}>🚨 PRIORITY DISPATCH</span>
                      )}
                    </div>
                    <div className="responsive-grid-3" style={{ gap: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(15, 22, 36, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Distance</span>
                        <span style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icons.MapPin /> {estimate.distance} km
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(15, 22, 36, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Time</span>
                        <span style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icons.Clock /> {estimate.eta} mins
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(15, 22, 36, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Fee</span>
                        <span style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ${estimate.deliveryFee.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px' }}>
                {loading ? 'Submitting Booking...' : 'Book Hyperlocal Dispatcher'}
              </button>
            </form>
          </div>

          {/* Right Column: Track Shipments */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '18px' }}>Shipments Outbox ({orders.length})</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.map((order) => (
                <div key={order._id} className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>#{order._id.substring(18)} - {order.customerName}</span>
                    {getStatusBadge(order)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      {order.isEmergency ? (
                        <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 800, color: '#f43f5e', background: 'rgba(244,63,94,0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(244,63,94,0.2)', marginRight: '6px' }}>🚨 EMERGENCY PRIORITY</span>
                      ) : null}
                      <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(14,165,233,0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(14,165,233,0.15)' }}>
                        {order.deliveryType === 'Scheduled' ? `📅 Scheduled` : `⚡ Instant`}
                      </span>
                    </div>
                    {order.deliveryType === 'Scheduled' && order.scheduledTime && (
                      <div style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.78rem', marginTop: '2px' }}>
                        📅 Deliver at: {new Date(order.scheduledTime).toLocaleString()}
                      </div>
                    )}
                    <div>Pickup: {order.pickupAddress}</div>
                    <div>Destination: {order.deliveryAddress}</div>
                    <div>Estimated distance: {order.distance} km | ETA: {order.eta} mins | Fare: ${order.deliveryFee}</div>
                    {order.rider && <div>Assigned Courier: <strong style={{ color: 'var(--primary)' }}>{order.rider.name} ({order.rider.phone || 'Courier App'})</strong></div>}
                    
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <div style={{ marginTop: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>🔑 Handover Verification OTP:</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '2px', fontFamily: 'monospace' }}>{order.deliveryOTP || '----'}</span>
                      </div>
                    )}
                  </div>

                  {order.deliveryType === 'Scheduled' && order.searchStatus === 'None' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <span>📅 Scheduled Booking: Automatic rider matching will begin near the scheduled delivery time.</span>
                    </div>
                  )}

                  {order.status === 'Pending' && order.searchStatus === 'Searching' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="spinner-small" style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid rgba(56, 189, 248, 0.2)',
                        borderTopColor: '#38bdf8',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span style={{ fontWeight: 500 }}>We are still searching for a rider near you...</span>
                    </div>
                  )}

                  {order.status === 'Pending' && order.searchStatus === 'Not Found' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 500 }}>⚠️ Anyone is not available near you. We couldn't find a rider.</span>
                        <button 
                          onClick={() => handleRetrySearch(order._id)}
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '0.78rem', width: 'auto', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 0 10px rgba(14, 165, 233, 0.4)' }}
                        >
                          Retry Search
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'Assigned' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⏳ Rider found! Waiting for rider to accept...</span>
                    </div>
                  )}

                  {/* Visual Stepper Tracker */}
                  {order.status !== 'Cancelled' && (
                    <div style={{ margin: '16px 0', padding: '8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
                        {/* Connecting Bar */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          right: '10px',
                          height: '2px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          zIndex: 0
                        }}></div>
                        
                        {/* Active Connecting Bar Fill */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          width: `${(getStatusStepIndex(order.status) / 3) * 100}%`,
                          height: '2px',
                          background: 'linear-gradient(90deg, var(--primary), var(--success))',
                          transition: 'all 0.4s ease',
                          zIndex: 0
                        }}></div>

                        {['Booked', 'Assigned', 'In Transit', 'Delivered'].map((step, idx) => {
                          const stepIndex = getStatusStepIndex(order.status);
                          const isActive = idx <= stepIndex;
                          const isCurrent = idx === stepIndex;
                          
                          return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: isCurrent ? 'var(--success)' : (isActive ? 'var(--primary)' : '#1e293b'),
                                border: isCurrent ? '4px solid rgba(16, 185, 129, 0.3)' : '2px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: isCurrent ? '0 0 10px var(--success)' : 'none'
                              }}>
                                {isActive && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                )}
                              </div>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: isActive ? 700 : 500,
                                color: isCurrent ? 'var(--success)' : (isActive ? 'var(--text-main)' : 'var(--text-muted)'),
                                marginTop: '4px',
                                textAlign: 'center'
                              }}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Detailed Timeline History Toggle */}
                  <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                    <button 
                      onClick={() => setExpandedTimelineId(expandedTimelineId === order._id ? null : order._id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'underline'
                      }}
                    >
                      {expandedTimelineId === order._id ? 'Hide Detailed Status History' : 'View Detailed Status History'}
                    </button>
                    
                    {expandedTimelineId === order._id && order.timeline && order.timeline.length > 0 && (
                      <div className="glass-panel" style={{ marginTop: '10px', padding: '12px', background: 'rgba(0,0,0,0.15)', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.timeline.map((event, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '4px' }}></div>
                                {idx < order.timeline.length - 1 && (
                                  <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '4px 0' }}></div>
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <strong style={{ color: '#fff' }}>{event.status}</strong>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{event.note || 'Milestone logged'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button onClick={() => handleDeleteOrder(order._id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.78rem', width: '100%' }}>
                      Cancel Order
                    </button>
                  )}
                </div>
              ))}
              {orders.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders found.</p>
              )}
            </div>
          </div>
        </div>
      )}


      
      {/* CSS Spin loader animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes flash-alert {
          0% { opacity: 0.85; filter: brightness(0.95); }
          100% { opacity: 1; filter: brightness(1.25); }
        }
      `}</style>
    </div>
  );
}

export default Home;