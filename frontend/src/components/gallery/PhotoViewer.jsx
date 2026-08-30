import Lightbox from 'yet-another-react-lightbox';

const PhotoViewer = ({ photos = [], activeIndex = -1, onClose }) => {
  if (activeIndex < 0) return null;

  const slides = photos.map(p => ({
    src: p.url,
    title: p.filename,
    description: p.isGuestUpload ? `Uploaded by ${p.guestName || 'Guest'}` : 'Uploaded by Organizer',
  }));

  return (
    <Lightbox
      open={activeIndex >= 0}
      close={onClose}
      index={activeIndex}
      slides={slides}
      styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' } }}
    />
  );
};

export default PhotoViewer;
