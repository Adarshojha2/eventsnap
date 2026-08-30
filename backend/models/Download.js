import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    requestedBy: {
      type: String, // IP address or userId string
      default: 'anonymous',
    },
    photoIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
      },
    ],
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'failed', 'expired'],
      default: 'pending',
    },
    zipUrl: {
      type: String,
      default: null,
    },
    zipPublicId: {
      type: String,
      default: null,
    },
    totalFiles: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true }
);

downloadSchema.index({ event: 1, createdAt: -1 });
downloadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Download', downloadSchema);
