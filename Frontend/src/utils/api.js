import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getAllUsers: () => api.get('/auth/users'),
  updateUser: (userId, data) => api.put(`/auth/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
};


export const sopAPI = {
  create: (data) => api.post('/sops', data),
  getAll: () => api.get('/sops'),
  getById: (sopId) => api.get(`/sops/${sopId}`),
  update: (sopId, data) => api.put(`/sops/${sopId}`, data),
  delete: (sopId) => api.delete(`/sops/${sopId}`),
  search: (query, tag) => api.get('/sops/search', { params: { ...(query ? { query } : {}), ...(tag ? { tag } : {}) } }),
};

export const auditAPI = {
  getAll: (limit = 50, page = 1) => api.get('/audit', { params: { limit, page } }),
  getByType: (type) => api.get(`/audit/type/${type}`),
  getByAction: (action) => api.get(`/audit/action/${action}`),
  clear: () => api.delete('/audit'),
};

export const contactAPI = {
  getAll: () => api.get('/contact/all'),
  getById: (contactId) => api.get(`/contact/${contactId}`),
  updateStatus: (contactId, status) => api.patch(`/contact/${contactId}/status`, { status }),
  delete: (contactId) => api.delete(`/contact/${contactId}`),
};

export default api;
