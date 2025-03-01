import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Save tokens in httpOnly cookies (handled by backend)
// But we'll keep minimal auth state in localStorage
const setAuthState = (user, hasTokens = true) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', JSON.stringify(hasTokens));
};

// Remove auth state
const removeAuthState = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
};

// Configure axios interceptors for token refresh
const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to get new token with refresh endpoint
          // Backend handles sending the refresh token via HttpOnly cookie
          const response = await axios.post(`${API_URL}auth/token/refresh/`, {}, {
            withCredentials: true // Important for cookies
          });
          
          // Retry the original request
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out user
          removeAuthState();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Start Google OAuth flow
const initiateGoogleLogin = async () => {
  try {
    const response = await axios.get(`${API_URL}auth/google/url/`);
    window.location.href = response.data.auth_url;
  } catch (error) {
    console.error('Failed to get Google auth URL:', error);
    throw error;
  }
};

// Handle OAuth callback
const handleGoogleCallback = async (code) => {
  try {
    const response = await axios.post(`${API_URL}auth/google/callback/`, { code });
    setAuthState(response.data.user);
    return response.data.user;
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

// Get user profile
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}auth/profile/`, {
      withCredentials: true
    });
    setAuthState(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    removeAuthState();
    throw error;
  }
};

// Logout function
const logout = async () => {
  try {
    // Call logout endpoint to clear cookies
    await axios.post(`${API_URL}auth/logout/`, {}, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthState();
  }
};

// Check if user is authenticated based on local state
const isAuthenticated = () => {
  return JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
};

// Get local user data
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Initialize axios interceptors
setupAxiosInterceptors();

export const authService = {
  initiateGoogleLogin,
  handleGoogleCallback,
  logout,
  getUserProfile,
  isAuthenticated,
  getUser
};