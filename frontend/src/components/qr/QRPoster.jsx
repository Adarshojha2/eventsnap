import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Camera } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';

const QRPoster = ({ eventUrl, eventName, eventDate, eventType, eventCode }) => {
  const posterRef = useRef(null);

  const handlePrint = () => {
    const printContent = posterRef.current?.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${eventName} — QR Code</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8f9ff; font-family: Inter, sans-serif; }
            .poster { background: white; border-radius: 24px; padding: 48px 40px; text-align: center; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
          </style>
        </head>
        <body><div class="poster">${printContent}</div></body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  return (
    <div>
      <div
        ref={posterRef}
        className="qr-poster mx-auto"
        style={{ background: 'white', borderRadius: 24, padding: 40, textAlign: 'center', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
        <div className="qr-poster-header">SCAN TO VIEW PHOTOS</div>
        <div className="qr-poster-title">{eventName}</div>
        {eventDate && (
          <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: 4 }}>
            📅 {formatDate(eventDate)}
          </div>
        )}
        <div className="qr-poster-qr">
          <div style={{ padding: 12, background: 'white', borderRadius: 12, border: '2px solid #f0f0f0' }}>
            <QRCodeSVG value={eventUrl} size={200} level="M" fgColor="#1a1a2e" bgColor="white" />
          </div>
        </div>
        <div style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: 8 }}>
          Scan this QR code to see and share all event memories.
        </div>
        <div
          style={{
            background: 'rgba(108,99,255,0.08)', borderRadius: 10, padding: '6px 14px',
            display: 'inline-block', fontFamily: 'monospace', fontSize: '0.9rem',
            fontWeight: 700, color: '#6C63FF', letterSpacing: '0.1em', marginBottom: 16,
          }}
        >
          {eventCode}
        </div>
        <div className="qr-poster-footer d-flex align-items-center justify-content-center gap-2">
          <Camera size={14} color="#6C63FF" />
          <span style={{ color: '#6C63FF', fontWeight: 700, fontSize: '0.8rem' }}>EventSnap</span>
          <span style={{ color: '#adb5bd' }}>•</span>
          <span>No app required</span>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-center mt-4 flex-wrap">
        <button onClick={handlePrint} className="btn d-flex align-items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #5849e8)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600 }}>
          <Printer size={16} /> Print Poster
        </button>
      </div>
    </div>
  );
};

export default QRPoster;
