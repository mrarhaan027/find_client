import axios from 'axios';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://find-client.onrender.com',
  withCredentials: true,
});

// ── Interceptor: har request mein localStorage token add karo ──
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor: response mein token mile toh localStorage mein save karo ──
API.interceptors.response.use((response) => {
  if (response.data?.token) {
    localStorage.setItem('lf_auth_token', response.data.token);
  }
  return response;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await API.get('/api/auth/me');
      if (data.success) setUser(data.user);
      else localStorage.removeItem('lf_auth_token');
    } catch {
      setUser(null);
      localStorage.removeItem('lf_auth_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await API.post('/api/auth/signout');
    } catch { }
    localStorage.removeItem('lf_auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
