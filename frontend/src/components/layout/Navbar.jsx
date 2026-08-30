import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Camera, LogOut, User, LayoutDashboard, Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="es-navbar px-3 px-md-5 py-3">
      <div className="d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="es-navbar-brand">
          <Camera size={28} color="#6C63FF" />
          Event<span>Snap</span>
        </Link>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `d-none d-md-flex align-items-center gap-2 text-decoration-none fw-500 ${isActive ? 'text-es-primary' : 'text-muted'}`
                }
                style={{ fontSize: '0.9rem', fontWeight: 500 }}
              >
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <Link
                to="/dashboard/create"
                className="btn-es-primary btn d-none d-md-flex align-items-center gap-2"
                style={{ padding: '8px 20px', fontSize: '0.875rem' }}
              >
                <Plus size={16} /> Create Event
              </Link>
              {/* User dropdown */}
              <div className="position-relative">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 rounded-pill"
                  style={{ fontSize: '0.875rem', fontWeight: 600, padding: '7px 14px', border: '1px solid #e8e8f0' }}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '12px', fontWeight: 700,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="d-none d-md-inline">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg py-2"
                    style={{ minWidth: 200, zIndex: 2000, border: '1px solid #e8e8f0' }}
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6c757d' }}>{user.email}</div>
                    </div>
                    <Link to="/dashboard" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => setMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => setMenuOpen(false)}>
                        <User size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-decoration-none text-muted fw-500" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-es-primary btn" style={{ padding: '9px 22px', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
