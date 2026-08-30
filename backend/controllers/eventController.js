import Event from '../models/Event.js';
import Photo from '../models/Photo.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { generateUniqueEventCode } from '../utils/generateEventCode.js';
import { sanitizeString } from '../utils/validators.js';
import { generateQRDataURL, getEventURL } from '../services/qrService.js';
import { recordQRScan, recordVisit } from '../services/analyticsService.js';
import { deleteFile } from '../services/cloudinaryService.js';
import { uploadToCloudinary } from '../middleware/upload.js';

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { name, type, date, location, description, privacy, eventPin, expiresAt, allowGuestUpload } = req.body;
    if (!name || !type || !date) return errorResponse(res, 'Event name, type, and date are required.', 400);

    const code = await generateUniqueEventCode();

    let coverImageUrl = null, coverImagePublicId = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'eventsnap/covers',
        resource_type: 'image',
        transformation: [{ width: 1280, height: 720, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
      });
      coverImageUrl = result.secure_url;
      coverImagePublicId = result.public_id;
    }

    let expiryDate = null;
    if (expiresAt && expiresAt !== 'never') {
      const daysMap = { '30': 30, '60': 60, '90': 90, '365': 365 };
      const days = daysMap[String(expiresAt)];
      if (days) { expiryDate = new Date(); expiryDate.setDate(expiryDate.getDate() + days); }
    }

    const event = await Event.create({
      code,
      name: sanitizeString(name),
      type,
      date: new Date(date),
      location: location ? sanitizeString(location) : undefined,
      description: description ? sanitizeString(description) : undefined,
      owner: req.user._id,
      coverImageUrl,
      coverImagePublicId,
      privacy: privacy || 'qr-only',
      eventPin: privacy === 'password-protected' ? eventPin : undefined,
      expiresAt: expiryDate,
      allowGuestUpload: allowGuestUpload !== false && allowGuestUpload !== 'false',
    });

    const eventUrl = getEventURL(code);
    const qrDataURL = await generateQRDataURL(eventUrl);
    return successResponse(res, { event, eventUrl, qrDataURL }, 'Event created successfully! 🎉', 201);
  } catch (error) {
    console.error('Create event error:', error);
    return errorResponse(res, error.message || 'Failed to create event.', 500);
  }
};

// GET /api/events
export const getMyEvents = async (req, res) => {
  try {
    const { search, status, sort = 'newest', page = 1, limit = 12 } = req.query;
    const query = { owner: req.user._id, isActive: true };
    if (search) query.name = { $regex: sanitizeString(search), $options: 'i' };
    if (status === 'active') query.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
    else if (status === 'expired') query.expiresAt = { $lte: new Date() };

    const sortObj = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [events, total] = await Promise.all([
      Event.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean({ virtuals: true }),
      Event.countDocuments(query),
    ]);
    return paginatedResponse(res, events, { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch events.', 500);
  }
};

// GET /api/events/:eventId
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, owner: req.user._id, isActive: true }).lean({ virtuals: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);
    const eventUrl = getEventURL(event.code);
    const qrDataURL = await generateQRDataURL(eventUrl);
    return successResponse(res, { event, eventUrl, qrDataURL });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch event.', 500);
  }
};

// PUT /api/events/:eventId
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, owner: req.user._id, isActive: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);

    const updatableFields = ['name', 'type', 'date', 'location', 'description', 'privacy', 'eventPin', 'allowGuestUpload'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = typeof req.body[field] === 'string' ? sanitizeString(req.body[field]) : req.body[field];
      }
    });

    if (req.file) {
      if (event.coverImagePublicId) await deleteFile(event.coverImagePublicId, 'image').catch(() => {});
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'eventsnap/covers',
        resource_type: 'image',
        transformation: [{ width: 1280, height: 720, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
      });
      event.coverImageUrl = result.secure_url;
      event.coverImagePublicId = result.public_id;
    }

    if (req.body.expiresAt !== undefined) {
      if (!req.body.expiresAt || req.body.expiresAt === 'never') {
        event.expiresAt = null;
      } else {
        const daysMap = { '30': 30, '60': 60, '90': 90, '365': 365 };
        const days = daysMap[String(req.body.expiresAt)];
        if (days) { const d = new Date(); d.setDate(d.getDate() + days); event.expiresAt = d; }
      }
    }

    await event.save();
    return successResponse(res, { event }, 'Event updated successfully.');
  } catch (error) {
    return errorResponse(res, 'Failed to update event.', 500);
  }
};

// DELETE /api/events/:eventId
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, owner: req.user._id });
    if (!event) return errorResponse(res, 'Event not found.', 404);
    event.isActive = false;
    await event.save();
    return successResponse(res, null, 'Event deleted successfully.');
  } catch (error) {
    return errorResponse(res, 'Failed to delete event.', 500);
  }
};

// GET /api/events/:eventId/qr
export const getEventQR = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, owner: req.user._id, isActive: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);
    const eventUrl = getEventURL(event.code);
    const qrDataURL = await generateQRDataURL(eventUrl);
    return successResponse(res, { eventUrl, qrDataURL, eventCode: event.code, eventName: event.name });
  } catch (error) {
    return errorResponse(res, 'Failed to generate QR code.', 500);
  }
};

// GET /api/events/public/:eventCode
export const getPublicEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ code: req.params.eventCode.toUpperCase(), isActive: true }).select('-eventPin').lean({ virtuals: true });
    if (!event) return errorResponse(res, 'Event not found. Please check the QR code or link.', 404);
    if (event.expiresAt && new Date() > new Date(event.expiresAt)) return errorResponse(res, 'This event has expired. Please contact the event organizer.', 410);
    if (event.privacy === 'private') return errorResponse(res, 'This is a private event.', 403);
    if (event.privacy === 'password-protected') {
      return successResponse(res, { requiresPin: true, eventName: event.name, eventType: event.type, eventDate: event.date, eventCode: event.code, location: event.location }, 'PIN required to access this event.');
    }
    recordQRScan(event._id).catch(() => {});
    recordVisit(event._id).catch(() => {});
    return successResponse(res, { event, requiresPin: false });
  } catch (error) {
    return errorResponse(res, 'Failed to load event.', 500);
  }
};

// POST /api/events/public/:eventCode/verify
export const verifyEventPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return errorResponse(res, 'PIN is required.', 400);
    const event = await Event.findOne({ code: req.params.eventCode.toUpperCase(), isActive: true, privacy: 'password-protected' }).select('+eventPin').lean({ virtuals: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);
    if (event.expiresAt && new Date() > new Date(event.expiresAt)) return errorResponse(res, 'This event has expired.', 410);
    if (event.eventPin !== String(pin)) return errorResponse(res, 'Incorrect PIN. Please try again.', 401);
    const { eventPin: _, ...safeEvent } = event;
    recordQRScan(event._id).catch(() => {});
    recordVisit(event._id).catch(() => {});
    return successResponse(res, { event: safeEvent, verified: true }, 'Access granted!');
  } catch (error) {
    return errorResponse(res, 'Verification failed.', 500);
  }
};
