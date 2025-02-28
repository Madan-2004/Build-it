// Install these packages:
// npm install @react-oauth/google jwt-decode axios

// src/services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Save tokens to localStorage
const setTokens = (tokens) => {
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
};

// Remove tokens from localStorage
const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Get the current access token
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

// Configure axios with JWT token
const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Get refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            removeTokens();
            return Promise.reject(error);
          }
          
          // Try to get new tokens
          const response = await axios.post(`${API_URL}auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          // Save new tokens
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out user
          removeTokens();
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Google login function
const googleLogin = async (tokenResponse) => {
  try {
    const response = await axios.post(`${API_URL}auth/google/`, {
      token: tokenResponse.credential
    });
    setTokens(response.data);
    return response.data.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Get user profile
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}auth/profile/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Logout function
const logout = () => {
  removeTokens();
};

// Check if user is logged in
const isLoggedIn = () => {
  return !!getAccessToken();
};

// Initialize axios interceptors
setupAxiosInterceptors();

export const authService = {
  googleLogin,
  logout,
  getUserProfile,
  isLoggedIn,
  getAccessToken
};


// src/App.jsx
