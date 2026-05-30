import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  assignRider,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  getDispatchStats,
  seedMockData
} from '../controllers/orderController.js';

const router = express.Router();

// Public/General routes (filters applied internally if logged in)
router.get('/', getOrders);

// Seeding route (convenient for setup)
router.post('/seed-mock-data', seedMockData);

// Protected routes
router.post('/create', authenticate, createOrder);
router.get('/stats', authenticate, getDispatchStats);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);

// Dispatch/Rider actions
router.put('/:id/assign', authenticate, assignRider);
router.put('/:id/accept', authenticate, acceptOrder);
router.put('/:id/reject', authenticate, rejectOrder);
router.put('/:id/status', authenticate, updateOrderStatus);

export default router;