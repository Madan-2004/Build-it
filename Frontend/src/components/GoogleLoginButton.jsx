import React from 'react';
import { authService } from '../services/auth';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    authService.initiateGoogleLogin();
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="google-btn"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;

// src/pages/LoginPage.jsx

