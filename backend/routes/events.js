import express from 'express';
import {
  createEvent, getMyEvents, getEventById, updateEvent,
  deleteEvent, getEventQR, getPublicEvent, verifyEventPin,
} from '../controllers/eventController.js';
import { guestUpload } from '../controllers/photoController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { uploadCover, uploadGuestPhotos } from '../middleware/upload.js';
import { qrScanLimiter, guestUploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Owner routes (protected)
router.post('/', protect, uploadCover, createEvent);
router.get('/', protect, getMyEvents);
router.get('/:eventId', protect, getEventById);
router.put('/:eventId', protect, uploadCover, updateEvent);
router.delete('/:eventId', protect, deleteEvent);
router.get('/:eventId/qr', protect, getEventQR);

// Public guest routes
router.get('/public/:eventCode', qrScanLimiter, getPublicEvent);
router.post('/public/:eventCode/verify', qrScanLimiter, verifyEventPin);

// Guest upload (no auth required) — POST /api/events/public/:eventCode/guest-upload
router.post('/public/:code/guest-upload', guestUploadLimiter, uploadGuestPhotos, guestUpload);

export default router;
