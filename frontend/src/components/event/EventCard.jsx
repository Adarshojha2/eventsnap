import { Link } from 'react-router-dom';
import { Calendar, MapPin, Camera, Video, Users, QrCode, Settings, ExternalLink } from 'lucide-react';
import { formatDate, formatNumber, getEventTypeEmoji, isEventExpired } from '../../utils/formatters';

const EVENT_BG_GRADIENTS = {
  Wedding: 'linear-gradient(135deg, #ff6b9d, #c44dff)',
  Birthday: 'linear-gradient(135deg, #f7971e, #ffd200)',
  Engagement: 'linear-gradient(135deg, #e96cff, #8b5cf6)',
  Reception: 'linear-gradient(135deg, #f093fb, #f5576c)',
  Puja: 'linear-gradient(135deg, #f7971e, #ff4e50)',
  'College Function': 'linear-gradient(135deg, #4facfe, #00f2fe)',
  'Corporate Event': 'linear-gradient(135deg, #2193b0, #6dd5ed)',
  Trip: 'linear-gradient(135deg, #56ab2f, #a8e063)',
  Party: 'linear-gradient(135deg, #ee9ca7, #ffdde1)',
  Other: 'linear-gradient(135deg, #606c88, #3f4c6b)',
};

const EventCard = ({ event, onDelete }) => {
  const expired = isEventExpired(event);
  const bg = EVENT_BG_GRADIENTS[event.type] || EVENT_BG_GRADIENTS.Other;

  return (
    <div className="es-card h-100" style={{ opacity: expired ? 0.75 : 1 }}>
      {/* Cover Image / Gradient */}
      <div
        style={{
          height: 160,
          background: event.coverImageUrl ? `url(${event.coverImageUrl}) center/cover no-repeat` : bg,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '12px',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            background: event.coverImageUrl ? 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' : 'rgba(0,0,0,0.15)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
          <span
            style={{
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px',
              padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600, color: 'white',
            }}
          >
            {getEventTypeEmoji(event.type)} {event.type}
          </span>
          {expired && (
            <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>Expired</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <h6 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: 8, lineHeight: 1.3 }}>
          {event.name}
        </h6>
        <div className="d-flex flex-column gap-1 mb-3">
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            <Calendar size={13} /> {formatDate(event.date)}
          </div>
          {event.location && (
            <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              <MapPin size={13} /> {event.location}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="d-flex gap-3 mb-3" style={{ padding: '10px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
          <div className="text-center">
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>{formatNumber(event.photoCount)}</div>
            <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>Photos</div>
          </div>
          <div className="text-center">
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>{formatNumber(event.guestUploadCount || 0)}</div>
            <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>Guest Uploads</div>
          </div>
          <div className="text-center ms-auto">
            <div
              style={{
                fontSize: '0.7rem', fontWeight: 600, color: '#6C63FF',
                background: 'rgba(108,99,255,0.08)', padding: '2px 8px', borderRadius: '50px'
              }}
            >
              {event.code}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <Link
            to={`/e/${event.code}`}
            target="_blank"
            className="btn btn-sm flex-1"
            style={{ flex: 1, background: '#f8f9ff', border: '1px solid #e8e8f0', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}
          >
            <ExternalLink size={13} /> Open
          </Link>
          <Link
            to={`/dashboard/events/${event._id}`}
            className="btn btn-sm"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #5849e8)', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, padding: '6px 14px' }}
          >
            <Settings size={13} /> Manage
          </Link>
          <Link
            to={`/dashboard/events/${event._id}/qr`}
            className="btn btn-sm"
            style={{ background: '#f8f9ff', border: '1px solid #e8e8f0', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}
            title="QR Code"
          >
            <QrCode size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
