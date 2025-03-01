import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

const CallbackPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = async () => {
      // Get code from URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      
      if (!code) {
        setError('No authorization code found in the callback URL');
        return;
      }
      
      try {
        await authService.handleGoogleCallback(code);
        navigate('/dashboard');
      } catch (err) {
        setError('Authentication failed. Please try again.');
        console.error(err);
      }
    };
    
    processCallback();
  }, [location, navigate]);
  
  if (error) {
    return (
      <div className="callback-error">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }
  
  return (
    <div className="callback-loading">
      <h2>Authenticating...</h2>
      <p>Please wait while we complete the sign-in process.</p>
    </div>
  );
};

export default CallbackPage;