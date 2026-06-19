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
  pickupLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  deliveryLocation: {
    lat: { type: Number },
    lng: { type: Number }
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
  assignedAt: {
    type: Date
  },
  searchStatus: {
    type: String,
    enum: ['Searching', 'Not Found', 'Assigned', 'None'],
    default: 'Searching'
  },
  declinedRiders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
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
  deliveryType: {
    type: String,
    enum: ['Instant', 'Scheduled'],
    default: 'Instant'
  },
  scheduledTime: {
    type: Date
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  deliveryOTP: {
    type: String
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

orderSchema.pre('save', function(next) {
  if (!this.deliveryOTP) {
    this.deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP code
  }
  next();
});

export default mongoose.model('Order', orderSchema);