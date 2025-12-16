import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Public API
export const publicAPI = {
  getAllRooms: () => axios.get(`${API_URL}/public/rooms`),
};

// Admin API
export const adminAPI = {
  createManager: (managerData) => api.post('/admin/managers', managerData),
  getAllManagers: () => api.get('/admin/managers'),
  getAllUsers: () => api.get('/admin/users'),
  getAllRooms: () => api.get('/admin/rooms'),
  getAllBookings: () => api.get('/admin/bookings'),
  getRevenue: () => api.get('/admin/revenue'),
};

// Manager API
export const managerAPI = {
  addRoom: (roomData) => api.post('/manager/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/manager/rooms/${id}`, roomData),
  getMyRooms: () => api.get('/manager/rooms'),
  getMyBookings: () => api.get('/manager/bookings'),
  updateBookingStatus: (id, status) => api.put(`/manager/bookings/${id}`, { bookingStatus: status }),
};

// User API
export const userAPI = {
  getAvailableRooms: () => api.get('/user/rooms'),
  bookRoom: (bookingData) => api.post('/user/bookings', bookingData),
  getMyBookings: () => api.get('/user/bookings'),
  cancelBooking: (id) => api.put(`/user/bookings/${id}/cancel`),
};

export default api;