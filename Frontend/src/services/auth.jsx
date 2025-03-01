// src/services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Check if user is authenticated
const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}auth/check/`);
    return response.data;
  } catch (error) {
    return { isAuthenticated: false };
  }
};

// Start Google OAuth flow
const initiateGoogleLogin = () => {
  // Get the Google auth URL from your backend
  axios.get(`${API_URL}auth/google/url/`)
    .then(response => {
      // Redirect to Google login
      window.location.href = response.data.auth_url;
    })
    .catch(error => {
      console.error('Failed to get Google auth URL:', error);
    });
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
  return axios.post(`${API_URL}auth/logout/`)
    .then(() => {
      window.location.href = '/login';
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
};

// Get user info from cookie
const getUserFromCookie = () => {
  const userInfoCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_info='));
  
  if (userInfoCookie) {
    try {
      // const userInfoValue = userInfoCookie.split('=')[1];
      // return JSON.parse(decodeURIComponent(userInfoValue));
      const userInfoValue = userInfoCookie.split('=')[1];
    console.log("Raw cookie value:", userInfoValue); // Log the raw value
    const decodedValue = decodeURIComponent(userInfoValue);
    console.log("Decoded value:", decodedValue); // Log the decoded value
    return JSON.parse(decodedValue);
    } catch (error) {
      console.error('Error parsing user info cookie:', error);
      return null;
    }
  }
  return null;
};

// Check if authenticated from cookie
const isAuthenticatedFromCookie = () => {
  return document.cookie
    .split('; ')
    .some(row => row.startsWith('is_authenticated=true'));
};

export const authService = {
  initiateGoogleLogin,
  checkAuth,
  getUserProfile,
  logout,
  getUserFromCookie,
  isAuthenticatedFromCookie
};

export default authService;