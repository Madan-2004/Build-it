import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminDashboard from '../elections/admin/AdminDashboard';
const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || [];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [headedClubs, setHeadedClubs] = useState([]);  // Clubs where the user is head
  const [memberClubs, setMemberClubs] = useState([]);  // Clubs where the user is a member
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user from cookie
        const userData = authService.getUserFromCookie();
        setUser(userData);

        if (userData && userData.email) {
          // Fetch clubs for the user
          const response = await axios.get(`http://localhost:8000/api/clubs/user-head/${userData.email}`);
          console.log(response.data);

          // Separate clubs into "headed" and "member" categories
          const headed = response.data.clubs.filter(club => club.status === "head");
          const member = response.data.clubs.filter(club => club.status === "member");

          setHeadedClubs(headed);
          setMemberClubs(member);
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
  useEffect(() => {
    if (user && user.email && adminEmails.includes(user.email)) {
      setIsAdmin(true);
    }
  }, [user]);

  const handleAdminDashboard = () => {
    navigate("/admin/dashboard"); // ✅ Redirect to Admin Dashboard when clicked
  };
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
    <div className="dark min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header: Title + Buttons */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
            {isAdmin && (
              <button
                onClick={handleAdminDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Go to Elections Dashboard
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>

        {user ? (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {user.username}!
            </h2>

            {/* Displaying user information */}
            <div className="space-y-2 mb-6">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.first_name && (
                <p>
                  <strong>First Name:</strong> {user.first_name}
                </p>
              )}
              {user.last_name && (
                <p>
                  <strong>Last Name:</strong> {user.last_name}
                </p>
              )}
            </div>

            {/* Clubs you lead */}
            <section className="user-clubs mb-8">
              <h2 className="text-xl font-semibold mb-4">Clubs You Lead</h2>
              {headedClubs.length === 0 ? (
                <p className="text-gray-400">
                  You are not currently the head of any clubs.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {headedClubs.map((club) => (
                    <Link
                      to={`/clubs/${club.name}`}
                      key={club.id}
                      className="block bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg rounded-lg p-4 hover:shadow-blue-400/50 transition"
                    >
                      <h3 className="text-lg font-bold">{club.name}</h3>
                      <p className="text-sm text-gray-200">
                        You are the head of this club
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Clubs where you are a member */}
            <section className="user-clubs">
              <h2 className="text-xl font-semibold mb-4">
                Clubs You Are a Member Of
              </h2>
              {memberClubs.length === 0 ? (
                <p className="text-gray-400">
                  You are not currently a member of any clubs.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memberClubs.map((club) => (
                    <Link
                      to={`/clubs/${club.name}`}
                      key={club.id}
                      className="block bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg rounded-lg p-4 hover:shadow-gray-400/50 transition"
                    >
                      <h3 className="text-lg font-bold">{club.name}</h3>
                      <p className="text-sm text-gray-300">Member</p>
                    </Link>
                  ))}
                </div>
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