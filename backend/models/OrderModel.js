import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Accepted', 'Arrived at Pickup', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true, default: 0 }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  },
  pickupPhone: {
    type: String,
    default: ''
  },
  deliveryPhone: {
    type: String,
    default: ''
  },
  distance: {
    type: Number,
    default: 0 // in km
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  eta: {
    type: Number,
    default: 0 // in minutes
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Prepaid'],
    default: 'Prepaid'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  codAmount: {
    type: Number,
    default: 0
  },
  timeline: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      note: { type: String, default: '' }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);