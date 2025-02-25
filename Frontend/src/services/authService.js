// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Your Django backend URL

const authService = {
  // Google authentication
  async googleLogin(tokenId) {
    try {
      const response = await axios.post(`${API_URL}/login/google/`, {
        token: tokenId,
      });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Regular login
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        email,
        password,
      });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  // Get current user
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await axios.get(`${API_URL}/auth/user/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
        refresh: refreshToken
      });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        return response.data.access;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }
};

export default authService;