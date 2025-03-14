// src/pages/AuthSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying authentication...');
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we're authenticated
        const { isAuthenticated, user } = await authService.checkAuth();
        
        if (isAuthenticated) {
          setStatus('Authentication successful! Redirecting...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setStatus('Authentication failed. Please try again.');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setStatus('An error occurred. Please try again.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };
    
    verifyAuth();
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Status</h2>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default AuthSuccess;