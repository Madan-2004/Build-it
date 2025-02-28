import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/auth';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleSuccess = async (tokenResponse) => {
    try {
      const user = await authService.googleLogin(tokenResponse);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginButton;
