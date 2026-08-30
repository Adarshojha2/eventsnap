import Photo from '../models/Photo.js';
import Event from '../models/Event.js';
import Album from '../models/Album.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { deleteFile, getThumbnailUrl } from '../services/cloudinaryService.js';
import { recordPhotoView, recordGuestUpload } from '../services/analyticsService.js';
import { uploadToCloudinary } from '../middleware/upload.js';

// POST /api/events/:eventId/photos — Batch upload photos
export const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No photos uploaded.', 400);
    }

    const event = await Event.findOne({ _id: req.params.eventId, owner: req.user._id, isActive: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);

    const { albumId } = req.body;
    if (albumId) {
      const album = await Album.findOne({ _id: albumId, event: event._id });
      if (!album) return errorResponse(res, 'Album not found in this event.', 404);
    }

    // Upload all files to Cloudinary in parallel
    const uploadResults = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: `eventsnap/events/${event._id}/photos`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        })
      )
    );

    const photoDocs = uploadResults.map((result, i) => ({
      event: event._id,
      album: albumId || null,
      url: result.secure_url,
      thumbnailUrl: getThumbnailUrl(result.public_id, 400, 400),
      publicId: result.public_id,
      filename: req.files[i].originalname,
      size: result.bytes || req.files[i].size,
      width: result.width || 0,
      height: result.height || 0,
      format: result.format || 'jpg',
      uploadedBy: req.user._id,
      isGuestUpload: false,
    }));

    const photos = await Photo.insertMany(photoDocs);

    await Event.findByIdAndUpdate(event._id, { $inc: { photoCount: photos.length } });

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $inc: { photoCount: photos.length },
        $set: { coverPhotoUrl: photos[0].url },
      });
    }

    return successResponse(res, { photos, count: photos.length }, `${photos.length} photo${photos.length !== 1 ? 's' : ''} uploaded successfully!`, 201);
  } catch (error) {
    console.error('Upload photos error:', error);
    return errorResponse(res, error.message || 'Failed to upload photos.', 500);
  }
};

// GET /api/events/:eventId/photos — Get event photos (paginated)
export const getEventPhotos = async (req, res) => {
  try {
    const { albumId, page = 1, limit = 24, favorites, sort = 'newest' } = req.query;
    const eventId = req.params.eventId;

    let event;
    if (req.user) {
      event = await Event.findOne({ _id: eventId, isActive: true, $or: [{ owner: req.user._id }, { privacy: { $in: ['public', 'qr-only', 'password-protected'] } }] });
    } else {
      event = await Event.findOne({ _id: eventId, isActive: true, privacy: { $in: ['public', 'qr-only'] } });
    }

    if (!event) return errorResponse(res, 'Event not found or access denied.', 404);

    const photoQuery = { event: eventId, isApproved: true };
    if (albumId && albumId !== 'all') photoQuery.album = albumId;
    if (favorites === 'true') photoQuery.isFavorited = true;

    const sortObj = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [photos, total] = await Promise.all([
      Photo.find(photoQuery).sort(sortObj).skip(skip).limit(parseInt(limit)).populate('album', 'name').lean(),
      Photo.countDocuments(photoQuery),
    ]);

    recordPhotoView(eventId).catch(() => {});

    return paginatedResponse(res, photos, { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch photos.', 500);
  }
};

// DELETE /api/photos/:photoId
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId).populate('event');
    if (!photo) return errorResponse(res, 'Photo not found.', 404);
    if (photo.event.owner.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized.', 403);

    await deleteFile(photo.publicId, 'image').catch((err) => console.warn('Cloudinary delete failed:', err.message));
    await photo.deleteOne();
    await Event.findByIdAndUpdate(photo.event._id, { $inc: { photoCount: -1 } });
    if (photo.album) await Album.findByIdAndUpdate(photo.album, { $inc: { photoCount: -1 } });

    return successResponse(res, null, 'Photo deleted successfully.');
  } catch (error) {
    return errorResponse(res, 'Failed to delete photo.', 500);
  }
};

// PATCH /api/photos/:photoId/favorite
export const toggleFavorite = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId).populate('event');
    if (!photo) return errorResponse(res, 'Photo not found.', 404);
    if (photo.event.owner.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized.', 403);
    photo.isFavorited = !photo.isFavorited;
    await photo.save();
    return successResponse(res, { isFavorited: photo.isFavorited });
  } catch (error) {
    return errorResponse(res, 'Failed to update favorite.', 500);
  }
};

// POST /api/guest-upload/:code — Guest upload
export const guestUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return errorResponse(res, 'No photos uploaded.', 400);

    const event = await Event.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);
    if (event.expiresAt && new Date() > event.expiresAt) return errorResponse(res, 'This event has expired.', 410);
    if (!event.allowGuestUpload) return errorResponse(res, 'Guest uploads are not allowed for this event.', 403);

    const guestName = req.body.guestName ? req.body.guestName.trim().slice(0, 50) : 'Guest';
    const guestIp = req.ip || req.headers['x-forwarded-for'];

    const uploadResults = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: `eventsnap/events/${event._id}/guest-uploads`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        })
      )
    );

    const photoDocs = uploadResults.map((result, i) => ({
      event: event._id,
      url: result.secure_url,
      thumbnailUrl: getThumbnailUrl(result.public_id, 400, 400),
      publicId: result.public_id,
      filename: req.files[i].originalname,
      size: result.bytes || req.files[i].size,
      uploadedBy: null,
      isGuestUpload: true,
      guestName,
      guestIp,
    }));

    const photos = await Photo.insertMany(photoDocs);
    await Event.findByIdAndUpdate(event._id, { $inc: { photoCount: photos.length, guestUploadCount: photos.length } });
    recordGuestUpload(event._id).catch(() => {});

    return successResponse(res, { count: photos.length }, `Thank you! ${photos.length} photo${photos.length !== 1 ? 's' : ''} shared successfully!`, 201);
  } catch (error) {
    console.error('Guest upload error:', error);
    return errorResponse(res, error.message || 'Upload failed. Please try again.', 500);
  }
};
