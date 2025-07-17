import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🚀 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Generic API functions
const apiService = {
  // Generic CRUD operations
  getAll: (endpoint) => api.get(`/${endpoint}`),
  getById: (endpoint, id) => api.get(`/${endpoint}/${id}`),
  create: (endpoint, data) => api.post(`/${endpoint}`, data),
  update: (endpoint, id, data) => api.put(`/${endpoint}/${id}`, data),
  delete: (endpoint, id) => api.delete(`/${endpoint}/${id}`),

  // Specific endpoints
  tdl: {
    getAll: () => api.get('/tdl'),
    getById: (id) => api.get(`/tdl/${id}`),
    create: (data) => api.post('/tdl', data),
    update: (id, data) => api.put(`/tdl/${id}`, data),
    delete: (id) => api.delete(`/tdl/${id}`),
  },

  tsf: {
    getAll: () => api.get('/tsf'),
    getById: (id) => api.get(`/tsf/${id}`),
    create: (data) => api.post('/tsf', data),
    update: (id, data) => api.put(`/tsf/${id}`, data),
    delete: (id) => api.delete(`/tsf/${id}`),
  },

  ac: {
    getAll: () => api.get('/ac'),
    getById: (id) => api.get(`/ac/${id}`),
    create: (data) => api.post('/ac', data),
    update: (id, data) => api.put(`/ac/${id}`, data),
    delete: (id) => api.delete(`/ac/${id}`),
  },

  dc: {
    getAll: () => api.get('/dc'),
    getById: (id) => api.get(`/dc/${id}`),
    create: (data) => api.post('/dc', data),
    update: (id, data) => api.put(`/dc/${id}`, data),
    delete: (id) => api.delete(`/dc/${id}`),
  },

  hvac: {
    getAll: () => api.get('/hvac'),
    getById: (id) => api.get(`/hvac/${id}`),
    create: (data) => api.post('/hvac', data),
    update: (id, data) => api.put(`/hvac/${id}`, data),
    delete: (id) => api.delete(`/hvac/${id}`),
  },

  genTsw: {
    getAll: () => api.get('/gen-tsw'),
    getById: (id) => api.get(`/gen-tsw/${id}`),
    create: (data) => api.post('/gen-tsw', data),
    update: (id, data) => api.put(`/gen-tsw/${id}`, data),
    delete: (id) => api.delete(`/gen-tsw/${id}`),
  },

  autre: {
    getAll: () => api.get('/autre'),
    getById: (id) => api.get(`/autre/${id}`),
    create: (data) => api.post('/autre', data),
    update: (id, data) => api.put(`/autre/${id}`, data),
    delete: (id) => api.delete(`/autre/${id}`),
  },

  besoin: {
    getAll: () => api.get('/besoin'),
    getById: (id) => api.get(`/besoin/${id}`),
    create: (data) => api.post('/besoin', data),
    update: (id, data) => api.put(`/besoin/${id}`, data),
    delete: (id) => api.delete(`/besoin/${id}`),
  },

  fournisseurs: {
    getAll: () => api.get('/fournisseurs'),
    getById: (id) => api.get(`/fournisseurs/${id}`),
    create: (data) => api.post('/fournisseurs', data),
    update: (id, data) => api.put(`/fournisseurs/${id}`, data),
    delete: (id) => api.delete(`/fournisseurs/${id}`),
  },

  fabricant: {
    getAll: () => api.get('/fabricant'),
    getById: (id) => api.get(`/fabricant/${id}`),
    create: (data) => api.post('/fabricant', data),
    update: (id, data) => api.put(`/fabricant/${id}`, data),
    delete: (id) => api.delete(`/fabricant/${id}`),
  },

  // Health check
  health: () => api.get('/health'),
};

export default apiService;
