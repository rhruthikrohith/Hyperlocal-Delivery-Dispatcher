import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import riderRoutes from './routes/riderRoutes.js';
import User from './models/UserModel.js';
import { startAssignmentTimeoutChecker } from './controllers/orderController.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  tlsAllowInvalidCertificates: true
})
.then(async () => {
  console.log('MongoDB Connected Successfully');
  try {
    const adminEmail = 'admin1@gmail.com';
    const adminPassword = 'rhrrhr';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default admin account created successfully.');
    } else {
      // Ensure default password matches rhrrhr in case it changed
      const isMatch = await bcrypt.compare(adminPassword, existingAdmin.password);
      if (!isMatch) {
        existingAdmin.password = await bcrypt.hash(adminPassword, 10);
        await existingAdmin.save();
        console.log('✅ Default admin password reset/updated to rhrrhr.');
      }
    }
  } catch (err) {
    console.error('Error auto-seeding admin:', err.message);
  }
})
.catch((err) => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/riders', riderRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Hyperlocal Dispatcher API Running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  startAssignmentTimeoutChecker();
});