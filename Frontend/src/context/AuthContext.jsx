// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const data = await authService.googleLogin(tokenId);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      return data;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    googleLogin,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);