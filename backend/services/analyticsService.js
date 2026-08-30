import Analytics from '../models/Analytics.js';

/**
 * Get today's date at midnight UTC for consistent daily grouping.
 */
const todayUTC = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Increment a specific analytics counter for an event for today.
 * Uses upsert to create the day's record if it doesn't exist.
 */
const increment = async (eventId, field, amount = 1) => {
  try {
    await Analytics.findOneAndUpdate(
      { event: eventId, date: todayUTC() },
      { $inc: { [field]: amount } },
      { upsert: true, new: true }
    );
  } catch (error) {
    // Analytics errors should not break the main flow
    console.error(`Analytics error (${field}):`, error.message);
  }
};

export const recordQRScan = (eventId) => increment(eventId, 'qrScans');
export const recordVisit = (eventId) => increment(eventId, 'uniqueVisitors');
export const recordPhotoView = (eventId) => increment(eventId, 'photosViewed');
export const recordDownload = (eventId) => increment(eventId, 'downloads');
export const recordGuestUpload = (eventId) => increment(eventId, 'guestUploads');

/**
 * Get analytics data for an event for the last N days.
 * @param {string} eventId
 * @param {number} days - Number of days of history to fetch
 */
export const getEventAnalytics = async (eventId, days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setUTCHours(0, 0, 0, 0);

  const records = await Analytics.find({
    event: eventId,
    date: { $gte: since },
  }).sort({ date: 1 });

  // Compute totals
  const totals = records.reduce(
    (acc, r) => {
      acc.qrScans += r.qrScans;
      acc.uniqueVisitors += r.uniqueVisitors;
      acc.photosViewed += r.photosViewed;
      acc.downloads += r.downloads;
      acc.guestUploads += r.guestUploads;
      return acc;
    },
    { qrScans: 0, uniqueVisitors: 0, photosViewed: 0, downloads: 0, guestUploads: 0 }
  );

  return { totals, daily: records };
};
