import express from 'express';
import { createAlbum, getAlbums, updateAlbum, deleteAlbum } from '../controllers/albumController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, createAlbum);
router.get('/', optionalAuth, getAlbums);
router.put('/:albumId', protect, updateAlbum);
router.delete('/:albumId', protect, deleteAlbum);

export default router;
