import api from './api';

export const createAlbum = (eventId, data) => api.post(`/events/${eventId}/albums`, data);
export const getAlbums = (eventId) => api.get(`/events/${eventId}/albums`);
export const updateAlbum = (eventId, albumId, data) => api.put(`/events/${eventId}/albums/${albumId}`, data);
export const deleteAlbum = (eventId, albumId) => api.delete(`/events/${eventId}/albums/${albumId}`);
