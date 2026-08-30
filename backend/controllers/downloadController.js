import Download from '../models/Download.js';
import Photo from '../models/Photo.js';
import Event from '../models/Event.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { createZipFromPhotos } from '../services/zipService.js';
import { recordDownload } from '../services/analyticsService.js';
import cloudinary from '../config/cloudinary.js';

// POST /api/downloads/request — Request a ZIP download
export const requestDownload = async (req, res) => {
  try {
    const { eventId, photoIds, albumId } = req.body;

    if (!eventId) return errorResponse(res, 'Event ID is required.', 400);

    const event = await Event.findOne({ _id: eventId, isActive: true });
    if (!event) return errorResponse(res, 'Event not found.', 404);

    let photos;
    if (albumId) {
      photos = await Photo.find({ event: eventId, album: albumId, isApproved: true })
        .select('url filename publicId').lean();
    } else if (photoIds && photoIds.length > 0) {
      photos = await Photo.find({ _id: { $in: photoIds }, event: eventId })
        .select('url filename publicId').lean();
    } else {
      // Download all photos
      photos = await Photo.find({ event: eventId, isApproved: true })
        .select('url filename publicId').lean();
    }

    if (photos.length === 0) {
      return errorResponse(res, 'No photos found to download.', 404);
    }

    // For small batches (<=5), create ZIP synchronously
    if (photos.length <= 5) {
      const zipBuffer = await createZipFromPhotos(
        photos.map((p, i) => ({ url: p.url, filename: p.filename || `photo_${i + 1}.jpg` })),
        event.name
      );

      recordDownload(eventId).catch(() => {});

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${event.name.replace(/[^a-z0-9]/gi, '_')}_photos.zip"`,
        'Content-Length': zipBuffer.length,
      });
      return res.send(zipBuffer);
    }

    // For large batches, create a download record and process async
    const requestedBy = req.user ? req.user._id.toString() : req.ip;
    const downloadRecord = await Download.create({
      event: eventId,
      requestedBy,
      photoIds: photos.map((p) => p._id),
      albumId: albumId || null,
      status: 'processing',
      totalFiles: photos.length,
    });

    // Process ZIP asynchronously
    (async () => {
      try {
        const zipBuffer = await createZipFromPhotos(
          photos.map((p, i) => ({ url: p.url, filename: p.filename || `photo_${i + 1}.jpg` })),
          event.name
        );

        // Upload ZIP to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'eventsnap/downloads',
              resource_type: 'raw',
              public_id: `${event.code}_${downloadRecord._id}`,
              format: 'zip',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(zipBuffer);
        });

        await Download.findByIdAndUpdate(downloadRecord._id, {
          status: 'ready',
          zipUrl: uploadResult.secure_url,
          zipPublicId: uploadResult.public_id,
        });

        recordDownload(eventId).catch(() => {});
      } catch (err) {
        console.error('Async ZIP creation failed:', err);
        await Download.findByIdAndUpdate(downloadRecord._id, { status: 'failed' });
      }
    })();

    return successResponse(
      res,
      { downloadId: downloadRecord._id, status: 'processing' },
      `Processing ${photos.length} photos. Your download will be ready shortly.`,
      202
    );
  } catch (error) {
    console.error('Download request error:', error);
    return errorResponse(res, 'Failed to initiate download.', 500);
  }
};

// GET /api/downloads/:downloadId — Check download status
export const getDownloadStatus = async (req, res) => {
  try {
    const download = await Download.findById(req.params.downloadId);
    if (!download) return errorResponse(res, 'Download not found.', 404);

    if (download.status === 'expired') {
      return errorResponse(res, 'Download link has expired. Please request again.', 410);
    }

    return successResponse(res, {
      status: download.status,
      zipUrl: download.zipUrl,
      totalFiles: download.totalFiles,
      expiresAt: download.expiresAt,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to check download status.', 500);
  }
};
