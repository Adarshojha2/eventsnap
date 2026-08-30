import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Share2, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const QRDisplay = ({ eventUrl, eventName, eventCode, size = 220 }) => {
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    toast.success('Event link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement('a');
      a.download = `eventsnap-qr-${eventCode}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    toast.success('QR code downloaded!');
  };

  const shareEvent = async () => {
    if (navigator.share) {
      await navigator.share({ title: eventName, text: `View photos from ${eventName}`, url: eventUrl });
    } else {
      copyLink();
    }
  };

  return (
    <div className="text-center">
      <div
        ref={svgRef}
        style={{
          display: 'inline-flex', padding: 20, background: 'white',
          borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          marginBottom: 20,
        }}
      >
        <QRCodeSVG
          value={eventUrl}
          size={size}
          level="M"
          fgColor="#1a1a2e"
          bgColor="white"
          includeMargin={false}
        />
      </div>

      <div className="mb-3">
        <div
          style={{
            background: '#f8f9ff', border: '1px solid #e8e8f0',
            borderRadius: 10, padding: '10px 16px',
            fontFamily: 'monospace', fontSize: '0.85rem', color: '#6C63FF',
            wordBreak: 'break-all', marginBottom: 12,
          }}
        >
          {eventUrl}
        </div>
        <div
          style={{
            display: 'inline-block', background: 'rgba(108,99,255,0.1)',
            borderRadius: 8, padding: '4px 12px', fontSize: '0.8rem',
            fontWeight: 700, color: '#6C63FF', letterSpacing: '0.05em',
          }}
        >
          Code: {eventCode}
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <button onClick={downloadQR} className="btn btn-sm d-flex align-items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #5849e8)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600 }}>
          <Download size={15} /> Download QR
        </button>
        <button onClick={copyLink} className="btn btn-sm d-flex align-items-center gap-2"
          style={{ background: '#f8f9ff', border: '1px solid #e8e8f0', borderRadius: 8, padding: '8px 16px', fontWeight: 600 }}>
          {copied ? <Check size={15} color="#00D4AA" /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button onClick={shareEvent} className="btn btn-sm d-flex align-items-center gap-2"
          style={{ background: '#f8f9ff', border: '1px solid #e8e8f0', borderRadius: 8, padding: '8px 16px', fontWeight: 600 }}>
          <Share2 size={15} /> Share
        </button>
      </div>
    </div>
  );
};

export default QRDisplay;
