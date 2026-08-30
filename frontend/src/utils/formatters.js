export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatNumber = (n) => {
  if (n === undefined || n === null) return '0';
  return Number(n).toLocaleString('en-IN');
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return `${bytes.toFixed(1)} ${units[i]}`;
};

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};

export const getEventTypeEmoji = (type) => {
  const map = {
    Wedding: '💍', Birthday: '🎂', Engagement: '💎', Reception: '🥂',
    Puja: '🪔', 'College Function': '🎓', 'Corporate Event': '🏢',
    Trip: '✈️', Party: '🎉', Other: '📸',
  };
  return map[type] || '📸';
};

export const getEventTypeBadgeClass = (type) => {
  const map = {
    Wedding: 'badge-wedding', Birthday: 'badge-birthday',
    'Corporate Event': 'badge-corporate', Trip: 'badge-trip',
    Puja: 'badge-puja',
  };
  return map[type] || 'badge-other';
};

export const isEventExpired = (event) => {
  if (!event?.expiresAt) return false;
  return new Date() > new Date(event.expiresAt);
};

export const getPrivacyLabel = (privacy) => {
  const map = {
    public: '🌐 Public', 'qr-only': '🔗 QR Only',
    'password-protected': '🔒 Password Protected', private: '🔐 Private',
  };
  return map[privacy] || privacy;
};

export const getPrivacyIcon = (privacy) => {
  const map = { public: '🌐', 'qr-only': '🔗', 'password-protected': '🔒', private: '🔐' };
  return map[privacy] || '🔗';
};
