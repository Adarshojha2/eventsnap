import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Camera, LayoutDashboard, Plus, BarChart2, Shield, LogOut, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/create', icon: Plus, label: 'Create Event' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', icon: Shield, label: 'Admin Panel' });
  }

  return (
    <aside className="es-sidebar d-none d-lg-flex">
      {/* Logo */}
      <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #e8e8f0' }}>
        <Link to="/" className="es-navbar-brand" style={{ textDecoration: 'none' }}>
          <Camera size={26} color="#6C63FF" />
          <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a1a2e' }}>
            Event<span style={{ color: '#6C63FF' }}>Snap</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `es-sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      <div style={{ borderTop: '1px solid #e8e8f0', paddingTop: 16 }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '15px', flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'capitalize' }}>
              {user?.plan} plan
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="es-sidebar-nav-item w-100 border-0 bg-transparent text-danger"
          style={{ cursor: 'pointer' }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
