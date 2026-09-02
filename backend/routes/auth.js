import express from 'express';
import { register, login, verifyEmailOtp, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/verify-otp', authLimiter, verifyEmailOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
