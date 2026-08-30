import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [150, 'Event name cannot exceed 150 characters'],
    },
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Wedding',
        'Birthday',
        'Engagement',
        'Reception',
        'Puja',
        'College Function',
        'Corporate Event',
        'Trip',
        'Party',
        'Other',
      ],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    coverImageUrl: {
      type: String,
      default: null,
    },
    coverImagePublicId: {
      type: String,
      default: null,
    },
    privacy: {
      type: String,
      enum: ['public', 'qr-only', 'password-protected', 'private'],
      default: 'qr-only',
    },
    eventPin: {
      type: String,
      default: null,
      select: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    allowGuestUpload: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    photoCount: {
      type: Number,
      default: 0,
    },
    videoCount: {
      type: Number,
      default: 0,
    },
    guestUploadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

eventSchema.index({ owner: 1, createdAt: -1 });
eventSchema.index({ code: 1 });
eventSchema.index({ isActive: 1, expiresAt: 1 });

// Virtual: is expired
eventSchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

export default mongoose.model('Event', eventSchema);
