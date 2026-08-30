import express from 'express';
import { requestDownload, getDownloadStatus } from '../controllers/downloadController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { downloadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/request', downloadLimiter, optionalAuth, requestDownload);
router.get('/:downloadId', getDownloadStatus);

export default router;
