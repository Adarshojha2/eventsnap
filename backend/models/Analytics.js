import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    qrScans: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    photosViewed: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    guestUploads: { type: Number, default: 0 },
  },
  { timestamps: false }
);

// Compound unique index — one record per event per day
analyticsSchema.index({ event: 1, date: 1 }, { unique: true });

export default mongoose.model('Analytics', analyticsSchema);
