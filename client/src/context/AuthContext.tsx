import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendOTP: (email: string, name?: string, password?: string) => Promise<boolean>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  sendPasswordResetOTP: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/is-authenticated`);
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        await checkAuth(); // Refresh user data
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration...', { name, email });
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      console.log('Registration response:', response.data);
      return response.data.success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      setUser(null);
    } catch (error) {
      setUser(null);
    }
  };

  const sendOTP = async (email: string, name?: string, password?: string): Promise<boolean> => {
    try {
      console.log('Sending OTP...', { email, name, hasPassword: !!password });
      const payload: any = { email };
      if (name && password) {
        payload.name = name;
        payload.password = password;
      }
      
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, payload);
      console.log('Send OTP response:', response.data);
      return response.data.success;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  const verifyEmail = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
        email,
        otp
      });
      
      if (response.data.success) {
        await checkAuth(); // Refresh user data
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const sendPasswordResetOTP = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-password-reset-otp`, {
        email
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    sendOTP,
    verifyEmail,
    sendPasswordResetOTP,
    resetPassword,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
