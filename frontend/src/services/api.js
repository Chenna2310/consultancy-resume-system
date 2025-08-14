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

// Employees API
export const employeesAPI = {
  getAll: (params = {}) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  search: (params) => api.get('/employees/search', { params }),
};

// Bench Candidates API
export const benchCandidatesAPI = {
  getAll: (params = {}) => api.get('/bench-candidates', { params }),
  getById: (id) => api.get(`/bench-candidates/${id}`),
  create: (formData) => {
    return api.post('/bench-candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, formData) => {
    return api.put(`/bench-candidates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/bench-candidates/${id}`),
  search: (params) => api.get('/bench-candidates/search', { params }),
  
  // Document management
  getDocuments: (candidateId) => api.get(`/bench-candidates/${candidateId}/documents`),
  uploadDocuments: (candidateId, formData) => {
    return api.post(`/bench-candidates/${candidateId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  downloadDocument: (candidateId, documentId) => {
    return api.get(`/bench-candidates/${candidateId}/documents/${documentId}`, {
      responseType: 'blob',
    });
  },
  deleteDocument: (candidateId, documentId) => {
    return api.delete(`/bench-candidates/${candidateId}/documents/${documentId}`);
  },
  
  // Legacy resume download (for backward compatibility)
  downloadResume: (id) => {
    return api.get(`/bench-candidates/${id}/resume`, {
      responseType: 'blob',
    });
  },
};

// Working Candidates API
export const workingCandidatesAPI = {
  getAll: (params = {}) => api.get('/working-candidates', { params }),
  getById: (id) => api.get(`/working-candidates/${id}`),
  create: (data) => api.post('/working-candidates', data),
  update: (id, data) => api.put(`/working-candidates/${id}`, data),
  delete: (id) => api.delete(`/working-candidates/${id}`),
  search: (params) => api.get('/working-candidates/search', { params }),
};

// Candidate Activities API
export const candidateActivitiesAPI = {
  getByCandidateId: (candidateId) => api.get(`/candidate-activities/candidate/${candidateId}`),
  create: (data) => api.post('/candidate-activities', data),
  update: (id, data) => api.put(`/candidate-activities/${id}`, data),
  delete: (id) => api.delete(`/candidate-activities/${id}`),
};

// Original Candidates API (for all candidates view)
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

// Analytics API (removed revenue-related APIs)
export const analyticsAPI = {
  getOverview: () => api.get('/dashboard/stats'),
  getConsultantPerformance: () => api.get('/dashboard/consultant-performance'),
  getVendorAnalytics: () => api.get('/dashboard/vendor-analytics'),
  getSubmissionTrends: (days = 30) => api.get(`/dashboard/submission-trends?days=${days}`),
  getSkillDemand: () => api.get('/dashboard/skill-demand'),
};

export default api;