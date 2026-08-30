import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import { ALLOWED_IMAGE_MIMES, ALLOWED_VIDEO_MIMES } from '../utils/validators.js';

const MAX_PHOTO_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '50') * 1024 * 1024;
const MAX_VIDEO_SIZE = parseInt(process.env.MAX_VIDEO_SIZE_MB || '500') * 1024 * 1024;
const MAX_COVER_SIZE = 10 * 1024 * 1024;

// Use memory storage — files are uploaded to Cloudinary via stream
const memoryStorage = multer.memoryStorage();

// MIME type filter for images
const imageFilter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.`), false);
  }
  cb(null, true);
};

// MIME type filter for videos
const videoFilter = (req, file, cb) => {
  if (!ALLOWED_VIDEO_MIMES.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Only MP4, WebM, and MOV videos are allowed.`), false);
  }
  cb(null, true);
};

// Upload a buffer to Cloudinary via stream
export const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Multer instances
export const uploadPhotos = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_PHOTO_SIZE, files: 20 },
}).array('photos', 20);

export const uploadGuestPhotos = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_PHOTO_SIZE, files: 10 },
}).array('photos', 10);

export const uploadVideo = multer({
  storage: memoryStorage,
  fileFilter: videoFilter,
  limits: { fileSize: MAX_VIDEO_SIZE, files: 1 },
}).single('video');

export const uploadCover = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_COVER_SIZE, files: 1 },
}).single('coverImage');
