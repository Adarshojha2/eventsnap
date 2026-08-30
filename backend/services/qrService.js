import QRCode from 'qrcode';

const QR_OPTIONS = {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 400,
  color: {
    dark: '#1a1a2e',
    light: '#ffffff',
  },
};

/**
 * Generate a QR code as a base64 data URL (PNG).
 * @param {string} text - The URL or text to encode
 * @returns {Promise<string>} - data:image/png;base64,...
 */
export const generateQRDataURL = async (text) => {
  try {
    return await QRCode.toDataURL(text, QR_OPTIONS);
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
};

/**
 * Generate a QR code as a PNG buffer.
 * @param {string} text
 * @returns {Promise<Buffer>}
 */
export const generateQRBuffer = async (text) => {
  try {
    return await QRCode.toBuffer(text, QR_OPTIONS);
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
};

/**
 * Generate the full guest event URL for a given event code.
 * @param {string} eventCode
 * @returns {string}
 */
export const getEventURL = (eventCode) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${baseUrl}/e/${eventCode}`;
};
