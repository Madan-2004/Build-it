// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First check if we can get user from cookie (faster)
        const cookieUser = authService.getUserFromCookie();
        if (cookieUser) {
          setUser(cookieUser);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const data = await authService.getUserProfile();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleLogout = () => {
    authService.logout()
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  };
  
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      
      {user ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.username}!</h2>
          
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            {user.first_name && <p><strong>First Name:</strong> {user.first_name}</p>}
            {user.last_name && <p><strong>Last Name:</strong> {user.last_name}</p>}
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>No user data available. Please try logging in again.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;