import api from './api';

export const uploadPhotos = (eventId, formData, onProgress) =>
  api.post(`/events/${eventId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });

export const getEventPhotos = (eventId, params) => api.get(`/events/${eventId}/photos`, { params });

export const deletePhoto = (photoId) => api.delete(`/photos/${photoId}`);

export const toggleFavorite = (photoId) => api.patch(`/photos/${photoId}/favorite`);

export const guestUpload = (eventCode, formData, onProgress) =>
  api.post(`/events/public/${eventCode}/guest-upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });

export const requestDownload = (data) => api.post('/downloads/request', data);
export const getDownloadStatus = (downloadId) => api.get(`/downloads/${downloadId}`);
