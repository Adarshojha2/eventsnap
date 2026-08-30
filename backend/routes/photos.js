import express from 'express';
import { uploadPhotos, getEventPhotos, deletePhoto, toggleFavorite, guestUpload } from '../controllers/photoController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { uploadPhotos as uploadMiddleware, uploadGuestPhotos } from '../middleware/upload.js';
import { guestUploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router({ mergeParams: true });

// /api/events/:eventId/photos
router.post('/', protect, uploadMiddleware, uploadPhotos);
router.get('/', optionalAuth, getEventPhotos);

// /api/photos/:photoId
router.delete('/:photoId', protect, deletePhoto);
router.patch('/:photoId/favorite', protect, toggleFavorite);

// /api/events/public/:code/guest-upload
router.post('/public/:code/guest-upload', guestUploadLimiter, uploadGuestPhotos, guestUpload);

export default router;
