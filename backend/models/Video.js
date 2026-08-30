import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: 'mp4',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isGuestUpload: {
      type: Boolean,
      default: false,
    },
    guestName: {
      type: String,
      trim: true,
      default: null,
    },
    isModerated: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

videoSchema.index({ event: 1, createdAt: -1 });

export default mongoose.model('Video', videoSchema);
