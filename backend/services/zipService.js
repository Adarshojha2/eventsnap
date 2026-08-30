import archiver from 'archiver';
import { Readable, PassThrough } from 'stream';

/**
 * Download a file from a URL and return a Buffer.
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
const fetchFileBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url} (${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/**
 * Create a ZIP buffer from an array of photo objects.
 * @param {Array<{url: string, filename: string}>} photos
 * @param {string} eventName
 * @returns {Promise<Buffer>}
 */
export const createZipFromPhotos = async (photos, eventName = 'EventSnap') => {
  return new Promise(async (resolve, reject) => {
    const chunks = [];
    const passThrough = new PassThrough();

    passThrough.on('data', (chunk) => chunks.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(chunks)));
    passThrough.on('error', reject);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', reject);
    archive.pipe(passThrough);

    // Process photos in batches to avoid memory issues
    const BATCH_SIZE = 10;
    for (let i = 0; i < photos.length; i += BATCH_SIZE) {
      const batch = photos.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (photo, batchIndex) => {
          try {
            const buffer = await fetchFileBuffer(photo.url);
            const filename = photo.filename || `photo_${i + batchIndex + 1}.jpg`;
            archive.append(buffer, { name: filename });
          } catch (err) {
            console.warn(`Skipping photo in ZIP (fetch failed): ${photo.url}`, err.message);
          }
        })
      );
    }

    archive.finalize();
  });
};
