import cloudinary from '../config/cloudinary.js';

/**
 * Delete a file from Cloudinary by public ID.
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Cloudinary delete error for ${publicId}:`, error.message);
    throw error;
  }
};

/**
 * Delete multiple files from Cloudinary.
 * @param {string[]} publicIds
 * @param {string} resourceType
 */
export const deleteFiles = async (publicIds, resourceType = 'image') => {
  try {
    if (!publicIds || publicIds.length === 0) return;
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error.message);
    throw error;
  }
};

/**
 * Generate a thumbnail URL from a Cloudinary public_id.
 * Uses Cloudinary URL transformation (no extra API call needed).
 * @param {string} publicId
 * @param {number} width
 * @param {number} height
 */
export const getThumbnailUrl = (publicId, width = 400, height = 400) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
  });
};

/**
 * Generate a full-size optimized URL.
 * @param {string} publicId
 * @param {number} maxWidth
 */
export const getOptimizedUrl = (publicId, maxWidth = 1920) => {
  return cloudinary.url(publicId, {
    width: maxWidth,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
  });
};

/**
 * Upload a buffer/stream directly to Cloudinary.
 * Used for generated content like QR codes.
 */
export const uploadBuffer = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
