import Masonry from 'react-masonry-css';
import { Heart, Trash2, Download } from 'lucide-react';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';

const PhotoGrid = ({
  photos = [],
  loading = false,
  onPhotoClick,
  onDelete,
  onToggleFavorite,
  isOwner = false,
  selectedPhotos = [],
  onSelectPhoto,
}) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (loading) {
    return <LoadingSkeleton type="gallery" count={8} />;
  }

  if (photos.length === 0) {
    return <EmptyState title="No photos found" description="Be the first to upload and share memories!" />;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="gallery-masonry"
      columnClassName="gallery-masonry-column"
    >
      {photos.map((photo) => {
        const isSelected = selectedPhotos.includes(photo._id);
        return (
          <div
            key={photo._id}
            className={`gallery-item ${photo.isGuestUpload ? 'guest-upload' : ''}`}
            style={{
              border: isSelected ? '4px solid #6C63FF' : 'none',
              transform: isSelected ? 'scale(0.98)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={photo.filename || 'Event photo'}
              loading="lazy"
              onClick={() => {
                if (selectedPhotos.length > 0 && onSelectPhoto) {
                  onSelectPhoto(photo._id);
                } else if (onPhotoClick) {
                  onPhotoClick(photo);
                }
              }}
            />
            
            {/* Selection Checkbox (if owner/editor supports batch) */}
            {isOwner && onSelectPhoto && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectPhoto(photo._id)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#6C63FF' }}
                />
              </div>
            )}

            {/* Hover overlay */}
            <div className="gallery-item-overlay">
              {/* Info Label */}
              <div className="me-auto text-white small text-truncate" style={{ maxWidth: '60%' }}>
                {photo.isGuestUpload ? `👤 ${photo.guestName || 'Guest'}` : '📸 Organizer'}
              </div>
              
              {/* Actions */}
              <div className="d-flex gap-1">
                {onToggleFavorite && isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(photo._id);
                    }}
                    className="btn btn-sm btn-light p-1 rounded-circle"
                    style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Heart size={14} color={photo.isFavorited ? '#FF6584' : '#6c757d'} fill={photo.isFavorited ? '#FF6584' : 'none'} />
                  </button>
                )}
                
                <a
                  href={photo.url}
                  download={photo.filename || 'eventsnap_photo.jpg'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn btn-sm btn-light p-1 rounded-circle"
                  style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Download size={14} color="#6c757d" />
                </a>

                {onDelete && isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this photo permanently?')) {
                        onDelete(photo._id);
                      }
                    }}
                    className="btn btn-sm btn-danger p-1 rounded-circle"
                    style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
                  >
                    <Trash2 size={14} color="white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Masonry>
  );
};

export default PhotoGrid;
