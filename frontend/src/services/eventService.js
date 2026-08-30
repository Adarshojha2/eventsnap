import api from './api';

export const createEvent = (data) => api.post('/events', data);
export const getMyEvents = (params) => api.get('/events', { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getEventQR = (id) => api.get(`/events/${id}/qr`);
export const getPublicEvent = (code) => api.get(`/events/public/${code}`);
export const verifyEventPin = (code, pin) => api.post(`/events/public/${code}/verify`, { pin });
