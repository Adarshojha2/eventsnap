import Album from '../models/Album.js';
import Photo from '../models/Photo.js';
import Event from '../models/Event.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sanitizeString } from '../utils/validators.js';

// Verify the requesting user owns the event
const verifyEventOwner = async (eventId, userId) => {
  const event = await Event.findOne({ _id: eventId, owner: userId, isActive: true });
  return event;
};

// POST /api/events/:eventId/albums
export const createAlbum = async (req, res) => {
  try {
    const event = await verifyEventOwner(req.params.eventId, req.user._id);
    if (!event) return errorResponse(res, 'Event not found.', 404);

    const { name, description } = req.body;
    if (!name) return errorResponse(res, 'Album name is required.', 400);

    const album = await Album.create({
      event: event._id,
      name: sanitizeString(name),
      description: description ? sanitizeString(description) : undefined,
      createdBy: req.user._id,
    });

    return successResponse(res, { album }, 'Album created successfully.', 201);
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'Album name already exists.', 409);
    return errorResponse(res, 'Failed to create album.', 500);
  }
};

// GET /api/events/:eventId/albums
export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ event: req.params.eventId })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return successResponse(res, { albums });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch albums.', 500);
  }
};

// PUT /api/albums/:albumId
export const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId).populate('event');
    if (!album) return errorResponse(res, 'Album not found.', 404);

    if (album.event.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    if (req.body.name) album.name = sanitizeString(req.body.name);
    if (req.body.description !== undefined) album.description = sanitizeString(req.body.description);
    if (req.body.order !== undefined) album.order = req.body.order;

    await album.save();
    return successResponse(res, { album }, 'Album updated successfully.');
  } catch (error) {
    return errorResponse(res, 'Failed to update album.', 500);
  }
};

// DELETE /api/albums/:albumId
export const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId).populate('event');
    if (!album) return errorResponse(res, 'Album not found.', 404);

    if (album.event.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    // Remove album reference from photos (keep photos, just unassign from album)
    await Photo.updateMany({ album: album._id }, { $set: { album: null } });

    await album.deleteOne();
    return successResponse(res, null, 'Album deleted. Photos have been moved to All Photos.');
  } catch (error) {
    return errorResponse(res, 'Failed to delete album.', 500);
  }
};
