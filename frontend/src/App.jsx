import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import CreateEvent from './pages/dashboard/CreateEvent';
import EventManage from './pages/dashboard/EventManage';
import QRPage from './pages/event/QRPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventPage from './pages/event/EventPage';
import Gallery from './pages/event/Gallery';
import GuestUpload from './pages/event/GuestUpload';
import ProtectedRoute from './components/layout/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Guest Experience (no auth required) */}
      <Route path="/e/:code" element={<EventPage />} />
      <Route path="/e/:code/gallery" element={<Gallery />} />
      <Route path="/e/:code/upload" element={<GuestUpload />} />

      {/* Owner Protected Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/create"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events/:eventId"
        element={
          <ProtectedRoute>
            <EventManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events/:eventId/qr"
        element={
          <ProtectedRoute>
            <QRPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Controlled Pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
