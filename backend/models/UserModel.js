import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+@.+\..+/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'rider', 'admin'],
    default: 'customer'
  },
  phone: {
    type: String,
    default: ''
  },
  // Rider specific fields
  riderStatus: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  riderWorkload: {
    type: String,
    enum: ['available', 'busy'],
    default: 'available'
  },
  currentLocation: {
    lat: { type: Number, default: 17.3850 },
    lng: { type: Number, default: 78.4867 }
  },
  earnings: {
    type: Number,
    default: 0
  },
  collectedCash: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
