import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Calendar, MapPin, AlignLeft, Shield, Clock, Camera, Plus, Check } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { createEvent } from '../../services/eventService';
import { EVENT_TYPES, PRIVACY_OPTIONS } from '../../utils/constants';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      privacy: 'qr-only',
      allowGuestUpload: true,
      expiresAt: 'never'
    }
  });

  const privacyValue = watch('privacy');

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('date', data.date);
      formData.append('location', data.location || '');
      formData.append('description', data.description || '');
      formData.append('privacy', data.privacy);
      formData.append('allowGuestUpload', data.allowGuestUpload);
      formData.append('expiresAt', data.expiresAt);

      if (data.privacy === 'password-protected' && data.eventPin) {
        formData.append('eventPin', data.eventPin);
      }

      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      await createEvent(formData);
      toast.success('Event created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-4" style={{ maxWidth: 720 }}>
        <div className="mb-4">
          <Link to="/dashboard" className="text-decoration-none text-muted small">← Back to Dashboard</Link>
          <h3 className="fw-bold mt-2" style={{ color: '#1a1a2e' }}>Create a New Event</h3>
          <p className="text-muted">Host your memories, print your custom QR poster, and gather guest shots.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-es p-4 border shadow-sm">
          {/* Event Name */}
          <div className="mb-3">
            <label className="form-label fw-bold small">Event Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="E.g., Wedding of Adarsh & Priya"
              style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
              {...register('name', { required: 'Event Name is required' })}
            />
            {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
          </div>

          {/* Type & Date */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold small">Event Type</label>
              <select
                className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                {...register('type', { required: 'Type is required' })}
              >
                <option value="">Select Event Type</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">Event Date</label>
              <input
                type="date"
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                {...register('date', { required: 'Date is required' })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label fw-bold small">Location</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ border: '1.5px solid #e8e8f0', borderRadius: '10px 0 0 10px' }}>
                <MapPin size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="E.g., Bhubaneswar, Odisha"
                style={{ borderRadius: '0 10px 10px 0', border: '1.5px solid #e8e8f0' }}
                {...register('location')}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-bold small">Description (Optional)</label>
            <textarea
              className="form-control"
              placeholder="Tell guests about the celebration..."
              rows={3}
              style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
              {...register('description')}
            />
          </div>

          {/* Cover Photo */}
          <div className="mb-4">
            <label className="form-label fw-bold small">Cover Photo (Optional)</label>
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: 120, height: 80, borderRadius: 12,
                  background: coverPreview ? `url(${coverPreview}) center/cover` : '#f0f0f0',
                  border: '1.5px solid #e8e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {!coverPreview && <Camera size={20} className="text-muted" />}
              </div>
              <div>
                <input
                  type="file"
                  id="coverImageUpload"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="d-none"
                />
                <label htmlFor="coverImageUpload" className="btn btn-outline-primary btn-sm mb-1" style={{ cursor: 'pointer', borderRadius: 8 }}>
                  Choose Image
                </label>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Max 10MB JPEG, PNG, WebP</div>
              </div>
            </div>
          </div>

          {/* Privacy Cards */}
          <div className="mb-4">
            <label className="form-label fw-bold small d-block">Privacy Settings</label>
            <div className="row g-3">
              {PRIVACY_OPTIONS.map((opt) => (
                <div className="col-12 col-md-6" key={opt.value}>
                  <label
                    className="p-3 border rounded-es d-block cursor-pointer hover-lift h-100"
                    style={{
                      borderColor: privacyValue === opt.value ? '#6C63FF' : '#e8e8f0',
                      background: privacyValue === opt.value ? 'rgba(108,99,255,0.02)' : 'white',
                      borderWidth: privacyValue === opt.value ? '2px' : '1px',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('privacy')}
                        style={{ accentColor: '#6C63FF' }}
                      />
                      <span className="fw-bold small">{opt.label}</span>
                    </div>
                    <p className="text-muted mb-0 small" style={{ fontSize: '0.78rem' }}>{opt.description}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* PIN Input (conditional) */}
          {privacyValue === 'password-protected' && (
            <div className="mb-4">
              <label className="form-label fw-bold small">Access PIN Code</label>
              <input
                type="text"
                placeholder="4 to 8 digit numeric PIN"
                className={`form-control ${errors.eventPin ? 'is-invalid' : ''}`}
                style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', maxWidth: 200 }}
                {...register('eventPin', { required: 'PIN is required', pattern: { value: /^\d{4,8}$/, message: 'Must be 4 to 8 digits' } })}
              />
            </div>
          )}

          {/* Event Expiration */}
          <div className="mb-4">
            <label className="form-label fw-bold small">Event Retention Expiry</label>
            <select className="form-select" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', maxWidth: 300 }} {...register('expiresAt')}>
              <option value="never">Never expire (Keep files permanent)</option>
              <option value="30">Expires after 30 days</option>
              <option value="60">Expires after 60 days</option>
              <option value="90">Expires after 90 days</option>
              <option value="365">Expires after 1 year</option>
            </select>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }} className="mt-1">Expired events immediately lock access to galleries.</div>
          </div>

          {/* Allow Guest Uploads */}
          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="guestUploadSwitch"
              style={{ accentColor: '#6C63FF' }}
              {...register('allowGuestUpload')}
            />
            <label className="form-check-label fw-bold small" htmlFor="guestUploadSwitch">
              Allow Guests to Upload Photos
            </label>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>If enabled, guests can upload photos without signing up.</div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-es-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <><div className="spinner-border spinner-border-sm" /> <span>Creating Event...</span></>
            ) : (
              <><Plus size={18} /> Create Event</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
