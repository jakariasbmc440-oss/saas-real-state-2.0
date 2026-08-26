import React, { createContext, useState, useEffect } from 'react';
import { apiCall, DEMO_MODE } from '../api/client.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (DEMO_MODE) {
        apiCall('login').then(res => {
          setUser(res.user);
          setLoading(false);
        });
      } else if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    const res = await apiCall('login', { email, password });
    setUser(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
