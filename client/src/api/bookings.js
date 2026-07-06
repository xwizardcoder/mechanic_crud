import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-user-role': 'admin',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error. Please check your connection.';
    return Promise.reject({ message, errors: error.response?.data?.errors || [] });
  }
);

// ─── Bookings API ─────────────────────────────────────────────

export const getBookings = (params = {}) =>
  api.get('/bookings', { params });

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

export const createBooking = (data) =>
  api.post('/bookings', data);

export const updateBooking = (id, data) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`);

export const getStats = () =>
  api.get('/bookings/stats');
