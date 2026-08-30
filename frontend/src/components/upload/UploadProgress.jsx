import { CheckCircle, XCircle, Loader } from 'lucide-react';

const UploadProgress = ({ progress, total, uploaded, failed, status }) => {
  return (
    <div className="es-card-flat p-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a2e' }}>
          {status === 'uploading' ? 'Uploading...' : status === 'done' ? '✅ Upload Complete!' : '❌ Upload Failed'}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
          {uploaded} / {total} photos
        </span>
      </div>
      <div className="upload-progress-bar mb-2">
        <div
          className="upload-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <span style={{ fontSize: '0.8rem', color: '#6C63FF', fontWeight: 600 }}>{progress}%</span>
        {failed > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#dc3545' }}>
            {failed} failed
          </span>
        )}
        {status === 'uploading' && (
          <Loader size={16} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
        )}
        {status === 'done' && <CheckCircle size={16} color="#00D4AA" />}
        {status === 'error' && <XCircle size={16} color="#dc3545" />}
      </div>
    </div>
  );
};

export default UploadProgress;
