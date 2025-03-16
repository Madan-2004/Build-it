import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  BarChart } from 'lucide-react';
import { 
  BarChart3, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  Loader, 
  PieChart, 
  Plus,
  RefreshCw,
  Settings,
  User,
  Users, 
  Vote
} from 'lucide-react';

const API_URL = "http://localhost:8000/";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch stats from the API
      const statsResponse = await axios.get(`${API_URL}api/admin/dashboard/stats/`, {
        withCredentials: true
      });
      
      // Fetch elections data
      const electionsResponse = await axios.get(`${API_URL}api/elections/`, {
        withCredentials: true
      });
      
      // Sort elections by status (active first, then upcoming, then past)
      const sortedElections = electionsResponse.data.sort((a, b) => {
        const now = new Date();
        const aStart = new Date(a.start_date);
        const aEnd = new Date(a.end_date);
        const bStart = new Date(b.start_date);
        const bEnd = new Date(b.end_date);
        
        // Define status priority
        const getStatusPriority = (start, end) => {
          if (now >= start && now <= end) return 1; // Active
          if (now < start) return 2; // Upcoming
          return 3; // Completed
        };
        
        return getStatusPriority(aStart, aEnd) - getStatusPriority(bStart, bEnd);
      });
      
      // Fetch recent votes (as a proxy for activity)
      const votesResponse = await axios.get(`${API_URL}api/votes/recent/`, {
        withCredentials: true
      });
      
      setStats(statsResponse.data);
      setElections(sortedElections);
      setRecentActivity(votesResponse.data || []);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling to refresh data every 2 minutes
    const intervalId = setInterval(fetchDashboardData, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to determine election status
  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);
    
    if (now >= startDate && now <= endDate) {
      return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
    } else if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
          <span className="mt-2 text-gray-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Election Administration Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            to="/admin/elections/create"
            className="flex items-center px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Election
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Elections</p>
              <p className="text-xl font-semibold">{stats?.total_elections || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Elections</p>
              <p className="text-xl font-semibold">{stats?.active_elections || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full">
              <CheckSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Positions</p>
              <p className="text-xl font-semibold">{stats?.total_positions || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full">
              <User className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-xl font-semibold">{stats?.total_candidates || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full">
              <Vote className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Votes</p>
              <p className="text-xl font-semibold">{stats?.total_votes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Elections List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Elections</h2>
              <Link to="/admin/elections" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="p-2">
              {elections.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <p>No elections found.</p>
                  <Link to="/admin/elections/create" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    Create your first election
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {elections.slice(0, 5).map((election) => {
                        const status = getElectionStatus(election);
                        return (
                          <tr key={election.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{election.title}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(election.start_date)} - {formatDate(election.end_date)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Link to={`/admin/elections/${election.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <Link to={`/admin/elections/${election.id}/positions`} className="text-green-600 hover:text-green-900">
                                  <Settings className="h-4 w-4" />
                                </Link>
                                <Link to={`/elections/${election.id}/results`} className="text-indigo-600 hover:text-indigo-900">
                                  <BarChart3 className="h-4 w-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Election Analytics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Election Analytics</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Card: Election Status Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <PieChart className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium">Election Status Distribution</h3>
            </div>
            <div className="h-48 flex items-center justify-center">
              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    {stats?.active_elections || 0}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Active</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {((stats?.total_elections || 0) - (stats?.active_elections || 0)) > 0 
                      ? (stats?.total_elections || 0) - (stats?.active_elections || 0) 
                      : 0}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Upcoming/Past</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Card: Voter Participation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-sm font-medium">Voter Participation</h3>
            </div>
            <div className="h-48 flex items-center justify-center">
              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {stats?.total_votes || 0}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Total Votes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {stats?.unique_voters || 0}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Unique Voters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third Card: Recent Activity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="text-sm font-medium">Recent Activity</h3>
            </div>
            <div className="h-48 overflow-y-auto">
              {stats?.recent_activity?.length > 0 ? (
                <ul className="space-y-2">
                  {stats.recent_activity.map((activity, index) => (
                    <li key={index} className="text-xs p-2 bg-white rounded border border-gray-100">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-gray-500"> - {activity.timestamp}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </div>

          {/* Fourth Card: Election Metrics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <BarChart className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="text-sm font-medium">Election Metrics</h3>
            </div>
            <div className="h-48 overflow-y-auto p-2">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Voter Turnout</span>
                    <span>{stats?.voter_turnout || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${stats?.voter_turnout || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Candidate Participation</span>
                    <span>{stats?.candidate_participation || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${stats?.candidate_participation || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Position Coverage</span>
                    <span>{stats?.position_coverage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${stats?.position_coverage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
    }
    export default AdminDashboard;