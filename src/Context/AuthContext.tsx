import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../Services/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user from localStorage if it exists
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('cwms_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('cwms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cwms_user');
    }
  }, [user]);

  // For Admin and Drivers - Manual login with credentials
  const login = async (email: string, password: string) => {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Check if user is admin or driver
    const role = email.includes('admin') ? 'admin' : 
                  email.includes('driver') ? 'driver' : null;
    
    // Prevent citizens from using email/password login
    if (!role) {
      throw new Error('Invalid credentials. Please use Google Sign-In for citizens.');
    }
    
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
    };
    setUser(mockUser);
  };

  // For Citizens - Google Sign-In
  const loginWithGoogle = async (googleData: any) => {
    // Only citizens should use Google login
    const mockUser: User = {
      id: googleData.sub || 'google-id',
      name: googleData.name || 'Google User',
      email: googleData.email || 'google@user.com',
      role: 'citizen', // Always citizen for Google users
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cwms_user');
  };

  const contextValue = useMemo(() => ({
    user,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};