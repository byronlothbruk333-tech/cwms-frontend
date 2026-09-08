import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors
    console.error('API Error:', error.response?.data || error.message);
    
    // Show user-friendly error message
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Reports API
export const reportsApi = {
  // Submit a new report
  create: async (data: {
    location: string;
    issueType: string;
    description: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  }) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  // Get all reports
  getAll: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  // Get a specific report
  getById: async (id: string | number) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Update report status
  updateStatus: async (id: string | number, status: string) => {
    const response = await api.put(`/reports/${id}/status`, { status });
    return response.data;
  },
};

export default api;