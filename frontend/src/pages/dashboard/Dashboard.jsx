import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, Search, Calendar, RefreshCw, Layers, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../../components/layout/Navbar';
import EventCard from '../../components/event/EventCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { getMyEvents, deleteEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { formatNumber } from '../../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [stats, setStats] = useState({ totalEvents: 0, totalPhotos: 0, totalGuests: 0 });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getMyEvents({ search, status, sort });
      setEvents(res.data.data);
      
      // Calculate basic stats locally
      const list = res.data.data;
      const totalPhotos = list.reduce((acc, ev) => acc + (ev.photoCount || 0), 0);
      const totalGuests = list.reduce((acc, ev) => acc + (ev.guestUploadCount || 0), 0); // using guest uploads count as fallback proxy
      setStats({
        totalEvents: list.length,
        totalPhotos,
        totalGuests,
      });
    } catch (err) {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [status, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This will archive it.')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully.');
        fetchEvents();
      } catch (err) {
        toast.error('Failed to delete event.');
      }
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 style={{ fontWeight: 800, color: '#1a1a2e', margin: 0 }}>Welcome back, {user?.name}!</h3>
            <p className="text-muted mb-0">Manage your events, customize QR codes, and view memory collections.</p>
          </div>
          <Link to="/dashboard/create" className="btn btn-es-primary d-flex align-items-center gap-2">
            <Plus size={18} /> Create Event
          </Link>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Events', val: stats.totalEvents, bg: 'rgba(108,99,255,0.1)', color: '#6C63FF' },
            { label: 'Photos Uploaded', val: stats.totalPhotos, bg: 'rgba(255,101,132,0.1)', color: '#FF6584' },
            { label: 'Guest Shares', val: stats.totalGuests, bg: 'rgba(0,212,170,0.1)', color: '#00D4AA' }
          ].map((stat, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="es-stat-card d-flex align-items-center gap-3">
                <div className="es-stat-icon" style={{ background: stat.bg }}>
                  <Layers size={22} color={stat.color} />
                </div>
                <div>
                  <div className="es-stat-number">{formatNumber(stat.val)}</div>
                  <div className="es-stat-label">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-es p-3 border mb-4 shadow-sm">
          <form onSubmit={handleSearch} className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-5">
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="text"
                  placeholder="Search events by name..."
                  className="form-control"
                  style={{ paddingLeft: 40, borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Status */}
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2">
                <SlidersHorizontal size={14} className="text-muted" />
                <select
                  className="form-select"
                  style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="expired">Expired Only</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                style={{ borderRadius: 10, border: '1.5px solid #e8e8f0' }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="col-12 col-md-1">
              <button type="submit" className="btn btn-dark w-100" style={{ borderRadius: 10 }}>
                Find
              </button>
            </div>
          </form>
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : events.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {events.map((event) => (
              <div className="col" key={event._id}>
                <EventCard event={event} onDelete={handleDeleteEvent} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No events found"
            description="You haven't created any events matching current filters yet."
            actionButton={
              <Link to="/dashboard/create" className="btn btn-es-primary">
                + Create Event
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
