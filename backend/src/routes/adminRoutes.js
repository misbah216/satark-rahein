import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  getAdminStats,
  getAllUsers,
  updateBroadcast,
  createQuestion,
} from '../controllers/adminController.js';

const router = express.Router();

// Admin only routes
router.get('/stats', requireAuth, requireRole('admin'), getAdminStats);
router.get('/users', requireAuth, requireRole('admin'), getAllUsers);
router.post('/broadcast', requireAuth, requireRole('admin'), updateBroadcast);
router.post('/questions', requireAuth, requireRole('admin'), createQuestion);

export default router;