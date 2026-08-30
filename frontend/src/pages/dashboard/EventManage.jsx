import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Camera, Image as ImageIcon, Upload, QrCode, Settings, Trash2, Heart } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import PhotoGrid from '../../components/gallery/PhotoGrid';
import DropZone from '../../components/upload/DropZone';
import UploadProgress from '../../components/upload/UploadProgress';
import QRDisplay from '../../components/qr/QRDisplay';
import QRPoster from '../../components/qr/QRPoster';
import { getEventById, updateEvent, deleteEvent } from '../../services/eventService';
import { getEventPhotos, deletePhoto, toggleFavorite, uploadPhotos } from '../../services/photoService';
import { getAlbums, createAlbum } from '../../services/albumService';

const EventManage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('photos');
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [loading, setLoading] = useState(true);

  // Upload States
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadedCount, setUploadedCount] = useState(0);

  // Album Form
  const [newAlbumName, setNewAlbumName] = useState('');

  const loadAll = async () => {
    try {
      const [evRes, photoRes, albumRes] = await Promise.all([
        getEventById(eventId),
        getEventPhotos(eventId, { limit: 100, albumId: selectedAlbum !== 'all' ? selectedAlbum : undefined }),
        getAlbums(eventId),
      ]);
      setEvent(evRes.data.data.event);
      setPhotos(photoRes.data.data);
      setAlbums(albumRes.data.data.albums);
    } catch (err) {
      toast.error('Failed to load event data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [eventId, selectedAlbum]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadedCount(0);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('photos', file));
    if (selectedAlbum !== 'all') formData.append('albumId', selectedAlbum);

    try {
      await uploadPhotos(eventId, formData, (percent) => {
        setUploadProgress(percent);
        setUploadedCount(Math.round((percent / 100) * selectedFiles.length));
      });
      setUploadStatus('done');
      toast.success('Photos uploaded successfully! 📸');
      setSelectedFiles([]);
      loadAll();
      setTimeout(() => setUploadStatus('idle'), 2000);
    } catch (err) {
      setUploadStatus('error');
      toast.error('Upload failed. Try smaller batches.');
    }
  };

  const handleToggleFavorite = async (photoId) => {
    try {
      await toggleFavorite(photoId);
      setPhotos(photos.map(p => p._id === photoId ? { ...p, isFavorited: !p.isFavorited } : p));
    } catch {
      toast.error('Failed to toggle favorite.');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await deletePhoto(photoId);
      setPhotos(photos.filter(p => p._id !== photoId));
      toast.success('Photo deleted.');
    } catch {
      toast.error('Failed to delete photo.');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    try {
      await createAlbum(eventId, { name: newAlbumName });
      setNewAlbumName('');
      toast.success('Album created!');
      const albumRes = await getAlbums(eventId);
      setAlbums(albumRes.data.data.albums);
    } catch {
      toast.error('Failed to create album.');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="mb-4">
          <Link to="/dashboard" className="text-decoration-none text-muted small">← Back to Dashboard</Link>
          <h3 className="fw-bold mt-2">{event?.name}</h3>
          <p className="text-muted mb-0">{event?.location} • {new Date(event?.date).toLocaleDateString()}</p>
        </div>

        {/* Tab List */}
        <div className="nav nav-pills mb-4 bg-white p-2 rounded-es border gap-2">
          {[
            { id: 'photos', label: 'Photos', icon: ImageIcon },
            { id: 'albums', label: 'Albums', icon: Camera },
            { id: 'upload', label: 'Upload Photos', icon: Upload },
            { id: 'qr', label: 'QR Poster', icon: QrCode }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-link px-4 py-2 d-flex align-items-center gap-2 rounded-es ${activeTab === id ? 'active bg-es-primary text-white' : 'text-muted bg-transparent'}`}
              onClick={() => setActiveTab(id)}
              style={{ fontWeight: 600, border: 'none' }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white border rounded-es p-4 shadow-sm">
          {activeTab === 'photos' && (
            <div>
              {/* Album filter */}
              <div className="mb-4 d-flex align-items-center gap-2">
                <span className="small fw-bold text-muted">Filter by Album:</span>
                <select
                  className="form-select w-auto"
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                >
                  <option value="all">All Photos</option>
                  {albums.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>

              <PhotoGrid
                photos={photos}
                onDelete={handleDeletePhoto}
                onToggleFavorite={handleToggleFavorite}
                isOwner={true}
              />
            </div>
          )}

          {activeTab === 'albums' && (
            <div>
              <form onSubmit={handleCreateAlbum} className="d-flex gap-2 mb-4 align-items-center" style={{ maxWidth: 400 }}>
                <input
                  type="text"
                  placeholder="Album name..."
                  className="form-control"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                />
                <button type="submit" className="btn btn-es-primary text-nowrap">
                  Create Album
                </button>
              </form>

              <div className="row row-cols-1 row-cols-md-3 g-3">
                {albums.map((alb) => (
                  <div key={alb._id} className="col">
                    <div className="border rounded-es p-3 d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-0">{alb.name}</h6>
                        <span className="text-muted small">{alb.photoCount || 0} photos</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <div className="mb-3" style={{ maxWidth: 300 }}>
                <label className="form-label small fw-bold text-muted">Select Target Album</label>
                <select
                  className="form-select"
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                >
                  <option value="all">Main Gallery (No Album)</option>
                  {albums.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>

              <DropZone onFilesSelected={setSelectedFiles} />
              
              {selectedFiles.length > 0 && uploadStatus === 'idle' && (
                <button onClick={handleUpload} className="btn btn-es-primary mt-3 w-100">
                  Upload {selectedFiles.length} photos
                </button>
              )}

              {uploadStatus !== 'idle' && (
                <div className="mt-3">
                  <UploadProgress
                    progress={uploadProgress}
                    total={selectedFiles.length}
                    uploaded={uploadedCount}
                    failed={0}
                    status={uploadStatus}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'qr' && event && (
            <div className="row g-4 justify-content-center">
              <div className="col-md-5">
                <QRDisplay
                  eventUrl={`${window.location.origin}/e/${event.code}`}
                  eventCode={event.code}
                  eventName={event.name}
                />
              </div>
              <div className="col-md-5">
                <QRPoster
                  eventUrl={`${window.location.origin}/e/${event.code}`}
                  eventCode={event.code}
                  eventName={event.name}
                  eventDate={event.date}
                  eventType={event.type}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManage;
