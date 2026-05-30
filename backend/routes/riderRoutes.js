import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  toggleStatus,
  updateLocation,
  getRiderStats,
  getOnlineRiders
} from '../controllers/riderController.js';

const router = express.Router();

// Protected rider-only routes
router.put('/toggle', authenticate, toggleStatus);
router.put('/location', authenticate, updateLocation);
router.get('/stats', authenticate, getRiderStats);

// Admin route to list online riders
router.get('/online', authenticate, getOnlineRiders);

export default router;
