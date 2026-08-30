export const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Engagement',
  'Reception',
  'Puja',
  'College Function',
  'Corporate Event',
  'Trip',
  'Party',
  'Other'
];

export const PRIVACY_OPTIONS = [
  { value: 'qr-only', label: 'QR Only', description: 'Access only via the unique QR code/link. Not listed publicly.' },
  { value: 'public', label: 'Public', description: 'Anyone can view and search for this event.' },
  { value: 'password-protected', label: 'Password Protected', description: 'Requires entering a 4-8 digit PIN code to access.' },
  { value: 'private', label: 'Private', description: 'Only you (the event owner) can view and upload.' }
];

export const PLAN_LIMITS = {
  free: { maxEvents: 1, maxPhotos: 500, storageDays: 30, videos: false },
  pro: { maxEvents: 'Unlimited', maxPhotos: 10000, storageDays: 365, videos: true },
  photographer: { maxEvents: 'Unlimited', maxPhotos: 'Unlimited', storageDays: 'Permanent', videos: true }
};
