import api from './api';
import type { User } from './types';

// ============================================
// TYPES
// ============================================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ============================================
// TOKEN MANAGEMENT
// ============================================
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('cleantrack_access_token', accessToken);
  localStorage.setItem('cleantrack_refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('cleantrack_access_token');
  localStorage.removeItem('cleantrack_refresh_token');
  localStorage.removeItem('cleantrack_user');
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('cleantrack_access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('cleantrack_refresh_token');
};

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  // ----------------------------------------
  // LOGIN
  // ----------------------------------------
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('cleantrack_user', JSON.stringify(user));
    return response.data;
  },

  // ----------------------------------------
  // REGISTER
  // ----------------------------------------
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('cleantrack_user', JSON.stringify(user));
    return response.data;
  },

  // ----------------------------------------
  // GOOGLE OAUTH
  // ----------------------------------------
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google', { idToken });
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('cleantrack_user', JSON.stringify(user));
    return response.data;
  },

  // ----------------------------------------
  // GET CURRENT USER
  // ----------------------------------------
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // ----------------------------------------
  // LOGOUT
  // ----------------------------------------
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors during logout
      console.warn('Logout API call failed:', error);
    } finally {
      clearTokens();
    }
  },

  // ----------------------------------------
  // REACTIVATE ACCOUNT
  // ----------------------------------------
  reactivate: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/reactivate', {
      email,
      password,
    });
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('cleantrack_user', JSON.stringify(user));
    return response.data;
  },

  // ----------------------------------------
  // CHANGE PASSWORD (admin/management only)
  // ----------------------------------------
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },

  // ----------------------------------------
  // GET STORED USER (from localStorage)
  // ----------------------------------------
  getStoredUser: (): User | null => {
    const stored = localStorage.getItem('cleantrack_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
};