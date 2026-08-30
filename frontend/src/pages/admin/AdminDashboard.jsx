import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, eventsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/events'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setEvents(eventsRes.data.data);
    } catch {
      toast.error('Failed to load admin dashboard details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/suspend`);
      toast.success(res.data.message);
      fetchAdminData();
    } catch {
      toast.error('Failed to suspend/unsuspend user.');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-4">Platform Administration Control Panel</h3>

        {/* Stats Grid */}
        {stats && (
          <div className="row g-3 mb-5">
            {[
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Total Events', value: stats.totalEvents },
              { label: 'Active Events', value: stats.activeEvents },
              { label: 'Photos Stored', value: stats.totalPhotos },
            ].map((s, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="bg-white border p-3 rounded-es text-center shadow-sm">
                  <div className="fw-bold text-muted small uppercase">{s.label}</div>
                  <h3 className="fw-bold mt-2 mb-0" style={{ color: '#6C63FF' }}>{s.value}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tables */}
        <div className="row g-4">
          {/* Users Table */}
          <div className="col-12 col-lg-6">
            <div className="bg-white border p-4 rounded-es shadow-sm">
              <h5 className="fw-bold mb-3">User Registry</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td className="text-muted small">{u.email}</td>
                        <td><span className="badge bg-secondary uppercase">{u.plan}</span></td>
                        <td>
                          <button
                            onClick={() => handleToggleSuspend(u._id)}
                            className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-success'}`}
                            style={{ borderRadius: 6 }}
                          >
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Events Table */}
          <div className="col-12 col-lg-6">
            <div className="bg-white border p-4 rounded-es shadow-sm">
              <h5 className="fw-bold mb-3">Platform Events</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Event Code</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Photos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e._id}>
                        <td><code className="text-primary">{e.code}</code></td>
                        <td>{e.name}</td>
                        <td><span className="badge bg-dark">{e.type}</span></td>
                        <td>{e.photoCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
