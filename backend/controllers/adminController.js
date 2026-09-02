import User from '../models/User.js';
import Event from '../models/Event.js';
import Photo from '../models/Photo.js';
import Video from '../models/Video.js';
import Subscription from '../models/Subscription.js';
import Analytics from '../models/Analytics.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalPhotos, totalVideos, activeEvents, qrScanTotals] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Photo.countDocuments(),
      Video.countDocuments(),
      Event.countDocuments({ isActive: true }),
      Analytics.aggregate([{ $group: { _id: null, total: { $sum: '$qrScans' } } }]),
    ]);
    return successResponse(res, {
      totalUsers,
      totalEvents,
      activeEvents,
      totalPhotos,
      totalVideos,
      totalQrGenerated: totalEvents,
      totalQrScans: qrScanTotals[0]?.total || 0,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch stats.', 500);
  }
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);
    return paginatedResponse(res, users, { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch users.', 500);
  }
};

// PUT /api/admin/users/:userId/suspend
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return errorResponse(res, 'User not found.', 404);
    if (user.role === 'admin') return errorResponse(res, 'Cannot suspend an admin.', 403);
    user.isActive = !user.isActive;
    await user.save();
    return successResponse(res, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'suspended'} successfully.`);
  } catch (error) {
    return errorResponse(res, 'Failed to update user.', 500);
  }
};

// GET /api/admin/events
export const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [events, total] = await Promise.all([
      Event.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('owner', 'name email'),
      Event.countDocuments(),
    ]);
    return paginatedResponse(res, events, { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch events.', 500);
  }
};

// DELETE /api/admin/events/:eventId
export const adminDeleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.eventId, { isActive: false });
    if (!event) return errorResponse(res, 'Event not found.', 404);
    return successResponse(res, null, 'Event deleted successfully.');
  } catch (error) {
    return errorResponse(res, 'Failed to delete event.', 500);
  }
};
