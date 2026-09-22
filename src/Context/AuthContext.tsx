/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { authService } from '../Services/authService';
import type { User } from '../Services/types';

// ============================================
// AUTH CONTEXT TYPE
// ============================================
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// AUTH PROVIDER
// ============================================
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // INITIAL LOAD — restore user from localStorage
  // and verify with backend
  // ============================================
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const token = localStorage.getItem('cleantrack_access_token');

      if (storedUser && token) {
        // Set user immediately from localStorage (fast)
        setUser(storedUser);

        // Then verify with backend (background)
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('cleantrack_user', JSON.stringify(freshUser));
        } catch (error) {
          // Token invalid — clear everything
          console.warn('Auth verification failed:', error);
          authService.logout();
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  // ============================================
  // GOOGLE LOGIN
  // ============================================
  const loginWithGoogle = async (idToken: string) => {
    const response = await authService.googleLogin(idToken);
    setUser(response.user);
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // ============================================
  // UPDATE USER (local + localStorage)
  // ============================================
  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('cleantrack_user', JSON.stringify(updated));
      return updated;
    });
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithGoogle,
      logout,
      updateUser,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// ============================================
// USE AUTH HOOK
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};