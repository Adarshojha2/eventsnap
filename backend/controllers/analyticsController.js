import Event from '../models/Event.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getEventAnalytics } from '../services/analyticsService.js';

// GET /api/analytics/:eventId
export const getAnalytics = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.eventId,
      owner: req.user._id,
      isActive: true,
    });

    if (!event) return errorResponse(res, 'Event not found.', 404);

    const days = parseInt(req.query.days) || 30;
    const analytics = await getEventAnalytics(event._id, days);

    return successResponse(res, {
      event: {
        _id: event._id,
        name: event.name,
        code: event.code,
        photoCount: event.photoCount,
        guestUploadCount: event.guestUploadCount,
      },
      analytics,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch analytics.', 500);
  }
};
