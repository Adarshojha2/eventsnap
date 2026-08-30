import express from 'express';
import { getAdminStats, getUsers, suspendUser, getAllEvents, adminDeleteEvent } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:userId/suspend', suspendUser);
router.get('/events', getAllEvents);
router.delete('/events/:eventId', adminDeleteEvent);

export default router;
