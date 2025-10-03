import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<{ verificationToken?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<{ verificationToken?: string }>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = async () => {
    try {
      // Check for mock user in localStorage (testing mode)
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        setUser(JSON.parse(mockUser));
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // TESTING MODE: Accept any credentials
    const mockUser: User = {
      id: 'test-user-id',
      email: email,
      name: email.split('@')[0],
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    return;

    // Original code commented out for testing
    /*
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    */
  };

  const signup = async (email: string, password: string, name?: string) => {
    // TESTING MODE: Accept any credentials
    const mockUser: User = {
      id: 'test-user-id',
      email: email,
      name: name || email.split('@')[0],
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    return { verificationToken: undefined };

    // Original code commented out for testing
    /*
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    setUser(data.user);
    return { verificationToken: data.verificationToken };
    */
  };

  const logout = async () => {
    try {
      // Clear mock user from localStorage
      localStorage.removeItem('mockUser');

      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return { resetToken: data.resetToken };
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Password reset failed');
    }
  };

  const verifyEmail = async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Verification failed');
    }

    // Refresh user data after verification
    await fetchCurrentUser();
  };

  const resendVerification = async () => {
    const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to resend verification');
    }

    return { verificationToken: data.verificationToken };
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
