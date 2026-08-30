import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Download, ChevronLeft, Layers, Film } from 'lucide-react';
import PhotoGrid from '../../components/gallery/PhotoGrid';
import PhotoViewer from '../../components/gallery/PhotoViewer';
import { getEventPhotos, requestDownload, getDownloadStatus } from '../../services/photoService';
import { getAlbums } from '../../services/albumService';
import { getPublicEvent } from '../../services/eventService';

const Gallery = () => {
  const { code } = useParams();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Lightbox index state
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Download States
  const [downloadingZip, setDownloadingZip] = useState(false);

  const initData = async () => {
    try {
      const evRes = await getPublicEvent(code);
      setEvent(evRes.data.data.event);
      
      const albumRes = await getAlbums(evRes.data.data.event._id);
      setAlbums(albumRes.data.data.albums);
      
      // Load initial photos
      const photoRes = await getEventPhotos(evRes.data.data.event._id, { page: 1, limit: 24 });
      setPhotos(photoRes.data.data);
      setHasMore(photoRes.data.pagination.pages > 1);
    } catch {
      toast.error('Failed to load event gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, [code]);

  const loadMorePhotos = async () => {
    if (!event) return;
    const nextPage = page + 1;
    try {
      const res = await getEventPhotos(event._id, {
        page: nextPage,
        limit: 24,
        albumId: selectedAlbum !== 'all' ? selectedAlbum : undefined
      });
      setPhotos([...photos, ...res.data.data]);
      setPage(nextPage);
      setHasMore(res.data.pagination.pages > nextPage);
    } catch {
      toast.error('Failed to load more photos.');
    }
  };

  const handleAlbumChange = async (albumId) => {
    setSelectedAlbum(albumId);
    setPage(1);
    setLoading(true);
    try {
      const res = await getEventPhotos(event._id, {
        page: 1,
        limit: 24,
        albumId: albumId !== 'all' ? albumId : undefined
      });
      setPhotos(res.data.data);
      setHasMore(res.data.pagination.pages > 1);
    } catch {
      toast.error('Failed to update photos filter.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    setDownloadingZip(true);
    toast.info('Preparing ZIP download...');
    try {
      const res = await requestDownload({
        eventId: event._id,
        albumId: selectedAlbum !== 'all' ? selectedAlbum : undefined,
      });

      const { downloadId, status } = res.data.data;
      if (status === 'ready' || !downloadId) {
        // Handled sync directly or has direct url
        setDownloadingZip(false);
        return;
      }

      // Large ZIP requires status check loop (poll)
      const interval = setInterval(async () => {
        try {
          const check = await getDownloadStatus(downloadId);
          if (check.data.data.status === 'ready') {
            clearInterval(interval);
            setDownloadingZip(false);
            window.open(check.data.data.zipUrl, '_blank');
            toast.success('ZIP download started!');
          } else if (check.data.data.status === 'failed') {
            clearInterval(interval);
            setDownloadingZip(false);
            toast.error('Failed to build ZIP file.');
          }
        } catch {
          clearInterval(interval);
          setDownloadingZip(false);
        }
      }, 3000);
    } catch {
      setDownloadingZip(false);
      toast.error('Could not request bulk download.');
    }
  };

  return (
    <div className="min-vh-100 bg-light pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom px-3 py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to={`/e/${code}`} className="btn btn-sm btn-light border d-flex align-items-center gap-1 rounded-pill">
            <ChevronLeft size={16} /> Event Info
          </Link>
          <span className="fw-bold">{event?.name}</span>
          <div style={{ width: 85 }}></div> {/* spacer */}
        </div>
      </nav>

      <div className="container py-4">
        {/* Album filters bar */}
        {albums.length > 0 && (
          <div className="d-flex gap-2 overflow-auto pb-3 mb-4 scrollbar-none" style={{ whiteSpace: 'nowrap' }}>
            <button
              onClick={() => handleAlbumChange('all')}
              className={`btn btn-sm px-4 py-2 rounded-pill fw-bold border ${selectedAlbum === 'all' ? 'btn-dark' : 'btn-light'}`}
            >
              All Photos
            </button>
            {albums.map((alb) => (
              <button
                key={alb._id}
                onClick={() => handleAlbumChange(alb._id)}
                className={`btn btn-sm px-4 py-2 rounded-pill fw-bold border ${selectedAlbum === alb._id ? 'btn-dark' : 'btn-light'}`}
              >
                {alb.name}
              </button>
            ))}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0">Gallery Collection</h5>
          <button
            onClick={handleDownloadAll}
            disabled={downloadingZip || photos.length === 0}
            className="btn btn-es-primary btn-sm d-flex align-items-center gap-2"
          >
            {downloadingZip ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <Download size={14} />
            )}
            Download ZIP
          </button>
        </div>

        {/* Grid */}
        <PhotoGrid
          photos={photos}
          loading={loading}
          onPhotoClick={(photo) => {
            const index = photos.findIndex(p => p._id === photo._id);
            setLightboxIndex(index);
          }}
        />

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-5">
            <button onClick={loadMorePhotos} className="btn btn-outline-dark px-5 py-2 rounded-pill">
              Load More Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <PhotoViewer
        photos={photos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
      />
    </div>
  );
};

export default Gallery;
