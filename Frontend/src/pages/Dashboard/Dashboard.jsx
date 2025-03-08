 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userClubs, setUserClubs] = useState([]);  // Default as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user from cookie
        const userData = authService.getUserFromCookie();
        setUser(userData);

        if (userData && userData.email) {

          const response = await axios.get(`http://localhost:8000/api/clubs/user-head/${userData.email}`);
          console.log(response.data);

          setUserClubs(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load your club data. Please try again later.');
      } finally {
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
    <div className="dark">
    <div className="max-w-4xl mx-auto p-6 ">
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

          {/* Displaying user information */}
          <div className="space-y-2 mb-6">
            <p><strong>Email:</strong> {user.email}</p>
            {user.first_name && <p><strong>First Name:</strong> {user.first_name}</p>}
            {user.last_name && <p><strong>Last Name:</strong> {user.last_name}</p>}

          </div>

          {/* Clubs you lead */}
          <section className="user-clubs">
            <h2 className="text-xl font-semibold mb-4">Clubs You Lead</h2>
            {userClubs.length === 0 ? (
              <p>You are not currently the head of any clubs.</p>
            ) : (
              <ul className="space-y-3">
                {userClubs.map((club) => (
                  <li key={club.id}>
                    <Link
                      to={`/clubs/${club.name}`}
                      className="block bg-gray-100 shadow rounded-lg p-4 hover:bg-gray-200 transition"
                    >
                      <h3 className="text-lg font-semibold">{club.name}</h3>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>No user data available. Please try logging in again.</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
