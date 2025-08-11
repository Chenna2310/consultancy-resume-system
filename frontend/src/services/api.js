// services/api.js
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  logout: () => api.post('/auth/signout'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Candidates API
export const candidatesAPI = {
  getAll: (params = {}) => api.get('/candidates', { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (formData) => {
    return api.post('/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, formData) => {
    return api.put(`/candidates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/candidates/${id}`),
  search: (params) => api.get('/candidates/search', { params }),
  getByStatus: (status) => api.get(`/candidates/status/${status}`),
  downloadResume: (id) => {
    return api.get(`/candidates/${id}/resume`, {
      responseType: 'blob',
    });
  },
};

// Vendors API
export const vendorsAPI = {
  getAll: (params = {}) => api.get('/vendors', { params }),
  getById: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
  search: (params) => api.get('/vendors/search', { params }),
  getByStatus: (status) => api.get(`/vendors/status/${status}`),
  getTopPerformers: (limit = 10) => api.get(`/vendors/top-performers?limit=${limit}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/dashboard/stats'),
  getRevenue: () => api.get('/dashboard/revenue-analytics'),
  getConsultantPerformance: () => api.get('/dashboard/consultant-performance'),
  getVendorAnalytics: () => api.get('/dashboard/vendor-analytics'),
  getSubmissionTrends: (days = 30) => api.get(`/dashboard/submission-trends?days=${days}`),
  getSkillDemand: () => api.get('/dashboard/skill-demand'),
};

export default api;