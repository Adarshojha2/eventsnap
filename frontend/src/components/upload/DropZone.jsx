import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

const DropZone = ({ onFilesSelected, maxFiles = 20, maxSizeMB = 50, accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] } }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles[0].errors[0]?.message || 'Some files were rejected.';
      setError(msg);
    }
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesSelected && onFilesSelected(newFiles);
  }, [files, maxFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles,
  });

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    onFilesSelected && onFilesSelected(updated);
  };

  const clearAll = () => {
    setFiles([]);
    onFilesSelected && onFilesSelected([]);
  };

  return (
    <div>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <Upload size={40} color={isDragActive ? '#6C63FF' : '#adb5bd'} style={{ marginBottom: 12 }} />
        <h6 style={{ fontWeight: 600, color: isDragActive ? '#6C63FF' : '#495057' }}>
          {isDragActive ? 'Drop photos here...' : 'Drag & drop photos, or click to browse'}
        </h6>
        <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: 0 }}>
          {accept['image/*']?.join(', ')} — Max {maxSizeMB}MB each — Up to {maxFiles} files
        </p>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mt-2 mb-0" style={{ fontSize: '0.85rem', borderRadius: 10 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e' }}>
              {files.length} photo{files.length !== 1 ? 's' : ''} selected
            </span>
            <button onClick={clearAll} className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.8rem', borderRadius: 8 }}>
              Clear All
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative', width: 80, height: 80,
                  borderRadius: 10, overflow: 'hidden', border: '2px solid #e8e8f0',
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => removeFile(idx)}
                  style={{
                    position: 'absolute', top: 2, right: 2, width: 20, height: 20,
                    borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', padding: 0,
                  }}
                >
                  <X size={11} color="white" />
                </button>
                <div
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.5)', color: 'white',
                    fontSize: '9px', padding: '2px 4px', textAlign: 'center',
                  }}
                >
                  {formatFileSize(file.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
