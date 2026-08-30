import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import QRDisplay from '../../components/qr/QRDisplay';
import QRPoster from '../../components/qr/QRPoster';
import { getEventById } from '../../services/eventService';

const QRPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await getEventById(eventId);
        setEvent(res.data.data.event);
      } catch {
        // Handled
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="min-vh-100 bg-light pb-5">
      <Navbar />
      <div className="container py-4">
        <div className="mb-4">
          <Link to={`/dashboard/events/${eventId}`} className="text-decoration-none text-muted small">← Back to Manage</Link>
          <h3 className="fw-bold mt-2">Print QR poster</h3>
        </div>

        {event && (
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
  );
};

export default QRPage;
