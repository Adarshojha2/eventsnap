import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Image, X, Camera, Calendar, MapPin, Lock, Clock, Users, Upload } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../services/api';
import { getEventById } from '../../services/eventService';

const EVENT_TYPES = [
  { value: 'wedding', label: '💍 Wedding' },
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'corporate', label: '🏢 Corporate' },
  { value: 'trip', label: '✈️ Trip / Vacation' },
  { value: 'puja', label: '🪔 Puja / Festival' },
  { value: 'college', label: '🎓 College / School' },
  { value: 'concert', label: '🎵 Concert / Show' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'other', label: '📸 Other' },
];

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const privacy = watch('privacy');

  useEffect(() => {
    getEventById(eventId)
      .then(res => {
        const e = res.data.data.event;
        setCoverPreview(e.coverImageUrl || null);
        reset({
          name: e.name,
          type: e.type,
          date: e.date ? e.date.split('T')[0] : '',
          location: e.location || '',
          description: e.description || '',
          privacy: e.privacy,
          allowGuestUpload: e.allowGuestUpload,
          expiresAt: 'never',
        });
      })
      .catch(() => { toast.error('Failed to load event.'); navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [eventId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: ([f]) => { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); },
    accept: { 'image/*': [] }, multiple: false, maxSize: 10 * 1024 * 1024,
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (coverFile) formData.append('cover', coverFile);
      await api.put(`/events/${eventId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Event updated!');
      navigate(`/events/${eventId}/manage`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}><Spinner size={40} /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => navigate(`/events/${eventId}/manage`)} className="btn" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', color: '#6c757d', padding: '8px 14px' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: '#1a1a2e', marginBottom: 2 }}>Edit Event</h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>Update event details and settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="es-card" style={{ padding: 28 }}>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera size={18} color="#6C63FF" /> Event Details
              </h5>
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>Event Name *</label>
                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }}
                  {...register('name', { required: 'Event name is required' })} />
                {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>Event Type</label>
                <select className="form-select" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }} {...register('type')}>
                  {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="mb-4">
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}><Calendar size={13} style={{ marginRight: 4 }} />Date</label>
                  <input type="date" className="form-control" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }} {...register('date')} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}><MapPin size={13} style={{ marginRight: 4 }} />Location</label>
                  <input type="text" className="form-control" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }} {...register('location')} />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>Description</label>
                <textarea rows={3} className="form-control" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', resize: 'none' }} {...register('description')} />
              </div>
            </div>

            <div className="es-card" style={{ padding: 28 }}>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={18} color="#6C63FF" /> Privacy Settings
              </h5>
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>Access Control</label>
                <select className="form-select" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }} {...register('privacy')}>
                  <option value="qr-only">🔗 QR Link Only</option>
                  <option value="public">🌐 Public</option>
                  <option value="password-protected">🔒 Password Protected</option>
                  <option value="private">🚫 Private</option>
                </select>
              </div>
              {privacy === 'password-protected' && (
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>New PIN (leave blank to keep current)</label>
                  <input type="text" className="form-control" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46, maxWidth: 200 }} {...register('eventPin')} />
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}><Clock size={13} style={{ marginRight: 4 }} />Expires After</label>
                  <select className="form-select" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }} {...register('expiresAt')}>
                    <option value="never">Keep Current / Never</option>
                    <option value="30">30 days from now</option>
                    <option value="60">60 days from now</option>
                    <option value="90">90 days from now</option>
                    <option value="365">1 year from now</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}><Users size={13} style={{ marginRight: 4 }} />Guest Uploads</label>
                  <select className="form-select" style={{ borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }} {...register('allowGuestUpload')}>
                    <option value={true}>✅ Allow</option>
                    <option value={false}>🚫 Disable</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="es-card" style={{ padding: 24 }}>
              <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Image size={18} color="#6C63FF" /> Cover Photo
              </h5>
              {coverPreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                  <img src={coverPreview} alt="Cover" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`} style={{ padding: '28px 16px' }}>
                  <input {...getInputProps()} />
                  <Upload size={24} color="#6C63FF" style={{ marginBottom: 8 }} />
                  <p style={{ margin: 0, fontWeight: 600, color: '#1a1a2e', fontSize: '0.875rem' }}>Click or drag to replace</p>
                </div>
              )}
            </div>
            <div className="es-card" style={{ padding: 24 }}>
              <button type="submit" disabled={saving} className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ background: saving ? '#adb5bd' : 'linear-gradient(135deg, #6C63FF, #5849e8)', color: 'white', border: 'none', borderRadius: 12, height: 52, fontWeight: 700, fontSize: '1rem' }}>
                {saving ? <><Spinner size={20} color="white" /> Saving...</> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default EditEvent;
