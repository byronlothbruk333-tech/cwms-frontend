import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// ============================================
// API BASE URL
// ============================================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// AXIOS INSTANCE
// ============================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// ============================================
// REQUEST INTERCEPTOR
// Attach JWT access token to every request
// ============================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('cleantrack_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR
// Handle token expiration — auto-refresh
// ============================================
let isRefreshing = false;

interface FailedQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not already retried → try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh on login/register/refresh endpoints
      const url = originalRequest.url || '';
      if (
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/google')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('cleantrack_refresh_token');

      if (!refreshToken) {
        // No refresh token — force logout
        isRefreshing = false;
        localStorage.removeItem('cleantrack_access_token');
        localStorage.removeItem('cleantrack_refresh_token');
        localStorage.removeItem('cleantrack_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('cleantrack_access_token', accessToken);
        localStorage.setItem('cleantrack_refresh_token', newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Refresh failed — clear everything and redirect to login
        localStorage.removeItem('cleantrack_access_token');
        localStorage.removeItem('cleantrack_refresh_token');
        localStorage.removeItem('cleantrack_user');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;