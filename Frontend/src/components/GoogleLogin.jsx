// src/components/GoogleLogin.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleLogin = () => {
  const { googleLogin } = useAuth();

  useEffect(() => {
    // Load the Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Initialize Google Sign-In when the script is loaded
    window.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '343307486631-rgmf2b0f05h1jaij0ebbmip2jculivqo.apps.googleusercontent.com', // Your Google Client ID
          callback: handleGoogleResponse
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          { theme: 'outline', size: 'large', width: 250 }
        );
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      // response.credential contains the JWT token from Google
      await googleLogin(response.credential);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div>
      <div id="google-login-button"></div>
    </div>
  );
};

export default GoogleLogin;
