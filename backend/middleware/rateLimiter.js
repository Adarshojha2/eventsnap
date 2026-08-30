import rateLimit from 'express-rate-limit';

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });

// General API limiter
export const apiLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  200,
  'Too many requests from this IP. Please try again in 15 minutes.'
);

// Strict limiter for auth routes
export const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  15,
  'Too many authentication attempts. Please try again in 15 minutes.'
);

// Guest upload limiter — prevents abuse
export const guestUploadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  30,
  'Upload limit reached. You can upload more photos in an hour.'
);

// QR scan limiter
export const qrScanLimiter = createLimiter(
  15 * 60 * 1000,
  300,
  'Too many requests. Please slow down.'
);

// Download request limiter
export const downloadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  20,
  'Too many download requests. Please try again later.'
);
