import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
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
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: 'jpg',
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
    guestIp: {
      type: String,
      default: null,
      select: false,
    },
    isFavorited: {
      type: Boolean,
      default: false,
    },
    isModerated: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    tags: [{ type: String, trim: true }],
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

photoSchema.index({ event: 1, createdAt: -1 });
photoSchema.index({ event: 1, album: 1 });
photoSchema.index({ event: 1, isGuestUpload: 1 });
photoSchema.index({ event: 1, isFavorited: 1 });

export default mongoose.model('Photo', photoSchema);
