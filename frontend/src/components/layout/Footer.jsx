import { Camera, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1a1a2e', color: 'rgba(255,255,255,0.7)', padding: '48px 0 24px' }}>
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-4 mb-4 mb-md-0">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Camera size={24} color="#6C63FF" />
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>
              Event<span style={{ color: '#6C63FF' }}>Snap</span>
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 260 }}>
            One QR code for every memory. Share event photos with everyone, instantly — no app required.
          </p>
        </div>
        <div className="col-6 col-md-2 mb-4 mb-md-0">
          <div style={{ fontWeight: 600, color: 'white', marginBottom: 12, fontSize: '0.875rem' }}>Product</div>
          {['Features', 'Pricing', 'Use Cases', 'FAQ'].map((item) => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>
                {item}
              </Link>
            </div>
          ))}
        </div>
        <div className="col-6 col-md-2 mb-4 mb-md-0">
          <div style={{ fontWeight: 600, color: 'white', marginBottom: 12, fontSize: '0.875rem' }}>Platform</div>
          {['Dashboard', 'Create Event', 'Guest Access'].map((item) => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>
                {item}
              </Link>
            </div>
          ))}
        </div>
        <div className="col-6 col-md-2">
          <div style={{ fontWeight: 600, color: 'white', marginBottom: 12, fontSize: '0.875rem' }}>Company</div>
          {['About', 'Blog', 'Contact', 'Privacy'].map((item) => (
            <div key={item} style={{ marginBottom: 8 }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>
                {item}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }} className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <span style={{ fontSize: '0.8rem' }}>© 2026 EventSnap. All rights reserved.</span>
        <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          Made with <Heart size={14} color="#FF6584" fill="#FF6584" /> for every celebration
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
