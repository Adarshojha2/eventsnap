import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Camera, Calendar, MapPin, Lock, Unlock, Eye, UploadCloud } from 'lucide-react';
import { getPublicEvent, verifyEventPin } from '../../services/eventService';
import { getEventTypeEmoji, formatDate } from '../../utils/formatters';

const EventPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  
  // PIN lock states
  const [pinRequired, setPinRequired] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const fetchEventDetails = async () => {
    try {
      const res = await getPublicEvent(code);
      const data = res.data.data;
      if (data.requiresPin) {
        setPinRequired(true);
        setEvent(data);
      } else {
        setEvent(data.event);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not access event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [code]);

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setPinError('');
    try {
      const res = await verifyEventPin(code, pin);
      if (res.data.data.verified) {
        setEvent(res.data.data.event);
        setPinRequired(false);
        toast.success('Access granted!');
      }
    } catch (err) {
      setPinError('Invalid PIN code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" style={{ color: '#6C63FF' }} />
      </div>
    );
  }

  // Cover background gradient mapping or URL
  const coverBg = event?.coverImageUrl
    ? `url(${event.coverImageUrl}) center/cover no-repeat`
    : 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)';

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Event Header Banner */}
      <div
        style={{
          background: coverBg,
          height: '40vh',
          minHeight: 280,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          padding: '24px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>
            {getEventTypeEmoji(event?.type || 'Other')}
          </div>
          <h2 className="fw-bold mb-2">{event?.name || event?.eventName}</h2>
          <div className="d-flex align-items-center justify-content-center gap-3 text-white-50 small flex-wrap">
            <span className="d-flex align-items-center gap-1">
              <Calendar size={14} /> {formatDate(event?.date || event?.eventDate)}
            </span>
            {(event?.location) && (
              <span className="d-flex align-items-center gap-1">
                <MapPin size={14} /> {event.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main flow content */}
      <div className="container flex-grow-1 py-5 d-flex justify-content-center align-items-start">
        <div style={{ width: '100%', maxWidth: 440 }}>
          {pinRequired ? (
            <div className="bg-white rounded-es border p-4 shadow-sm text-center">
              <Lock size={44} color="#FF6584" style={{ marginBottom: 16 }} />
              <h5 className="fw-bold mb-2">Password Protected</h5>
              <p className="text-muted small mb-4">This photo gallery is locked. Please enter the event PIN code to enter.</p>
              
              <form onSubmit={handleVerifyPin}>
                <div className="mb-3">
                  <input
                    type="password"
                    maxLength={8}
                    placeholder="Enter PIN"
                    className="form-control text-center fw-bold"
                    style={{ letterSpacing: '0.5em', fontSize: '1.25rem', borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  />
                  {pinError && <div className="text-danger small mt-2">{pinError}</div>}
                </div>
                <button type="submit" className="btn btn-es-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <Unlock size={16} /> Unlock Gallery
                </button>
              </form>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              <button
                onClick={() => navigate(`/e/${code}/gallery`)}
                className="btn btn-es-primary w-100 py-3 d-flex align-items-center justify-content-center gap-3 fs-5"
                style={{ borderRadius: 14 }}
              >
                <Eye size={22} /> View Photos
              </button>

              {event?.allowGuestUpload && (
                <button
                  onClick={() => navigate(`/e/${code}/upload`)}
                  className="btn btn-light w-100 py-3 d-flex align-items-center justify-content-center gap-3 fs-5"
                  style={{ borderRadius: 14, border: '1.5px solid #e8e8f0', color: '#1a1a2e', fontWeight: 600 }}
                >
                  <UploadCloud size={22} color="#6C63FF" /> Share My Photos
                </button>
              )}

              <div className="text-center mt-4">
                <span className="small text-muted">Powered by <strong className="text-es-primary">EventSnap</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
