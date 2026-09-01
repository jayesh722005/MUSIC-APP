import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('aura_token');
      const storedUser = localStorage.getItem('aura_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load auth from storage', e);
      localStorage.removeItem('aura_token');
      localStorage.removeItem('aura_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Backend logout failed/ignored', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const isArtist = user?.role === 'artist';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isArtist,
        login,
        register,
        logout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
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
