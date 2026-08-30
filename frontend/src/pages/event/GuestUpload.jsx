import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronLeft, Camera, CheckCircle } from 'lucide-react';
import DropZone from '../../components/upload/DropZone';
import UploadProgress from '../../components/upload/UploadProgress';
import { guestUpload } from '../../services/photoService';

const GuestUpload = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [guestName, setGuestName] = useState('');
  
  // Upload States
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [uploaded, setUploaded] = useState(0);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setStatus('uploading');
    setProgress(0);
    setUploaded(0);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('photos', file));
    formData.append('guestName', guestName || 'Anonymous Guest');

    try {
      await guestUpload(code, formData, (percent) => {
        setProgress(percent);
        setUploaded(Math.round((percent / 100) * selectedFiles.length));
      });
      
      setStatus('done');
      toast.success('Successfully shared! 🎉');
      setSelectedFiles([]);
      setTimeout(() => {
        navigate(`/e/${code}`);
      }, 2000);
    } catch (err) {
      setStatus('error');
      toast.error(err.response?.data?.message || 'Upload failed.');
    }
  };

  return (
    <div className="min-vh-100 bg-light pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom px-3 py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to={`/e/${code}`} className="btn btn-sm btn-light border d-flex align-items-center gap-1 rounded-pill">
            <ChevronLeft size={16} /> Cancel
          </Link>
          <span className="fw-bold">Upload Photos</span>
          <div style={{ width: 85 }}></div> {/* spacer */}
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: 500 }}>
        {status === 'done' ? (
          <div className="bg-white border rounded-es p-5 text-center shadow-sm">
            <CheckCircle size={56} color="#00D4AA" className="mb-3" />
            <h4 className="fw-bold text-dark">Photos Shared!</h4>
            <p className="text-muted mb-0">Your photos were added to the event gallery successfully.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-es p-4 shadow-sm">
            <div className="text-center mb-4">
              <Camera size={36} color="#6C63FF" className="mb-2" />
              <h5 className="fw-bold">Share Your Event Photos</h5>
              <p className="text-muted small">Upload your best memories to show the event organizer.</p>
            </div>

            {/* Guest Name input */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="E.g., Uncle Joy, Cousin Sneha"
                className="form-control"
                style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                disabled={status === 'uploading'}
              />
            </div>

            <DropZone onFilesSelected={setSelectedFiles} maxFiles={10} />

            {selectedFiles.length > 0 && status === 'idle' && (
              <button
                onClick={handleUpload}
                className="btn btn-es-primary w-100 mt-4 py-2"
                style={{ borderRadius: 10 }}
              >
                Upload {selectedFiles.length} photos
              </button>
            )}

            {status !== 'idle' && (
              <div className="mt-4">
                <UploadProgress
                  progress={progress}
                  total={selectedFiles.length}
                  uploaded={uploaded}
                  failed={0}
                  status={status}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestUpload;
