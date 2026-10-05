import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vsit_cep_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('vsit_cep_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('vsit_cep_token', res.token);
        localStorage.setItem('vsit_cep_user', JSON.stringify(res.user));
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server communication error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vsit_cep_token');
    localStorage.removeItem('vsit_cep_user');
  };

  const isAdmin = user && user.role === 'admin';
  const isTeam = user && (user.role === 'team' || user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isTeam, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
