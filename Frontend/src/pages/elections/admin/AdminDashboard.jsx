import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Link } from "react-router-dom";
import AdminElectionsList from "./AdminElectionsList";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const API_URL = "http://localhost:8000/api/admin/dashboard/stats/";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [recentElections, setRecentElections] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [trendType, setTrendType] = useState("monthly");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authCheck = await axios.get(`$http://localhost:8000/api/auth/check/`, { withCredentials: true });
        if (!authCheck.data.isAuthenticated) {
          console.log("User is not authenticated. Attempting to refresh session.");
          await refreshSession();  // Try refreshing session
        }
        else{
          console.log("User is authenticated");
        }
        const statsResponse = await axios.get(API_URL);
        console.log("Dashboard Stats:", statsResponse.data);
        setStats(statsResponse.data);
        
        // Keep the existing mock data for recentElections and recentActivity
        // ...

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const refreshSession = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/auth/token/refresh/`,
          {},  // No need to manually include token in body, it should be sent via cookies
          {
            withCredentials: true,  // Ensures cookies are sent
          }
        );
    
        console.log("Session refreshed successfully.", response.data);
        // localStorage.setItemr("access_token", response.data.access);
      } catch (error) {
        console.error("Session refresh failed:", error.response?.data || error.message);
      }
    };
  }, []);

  // ... (keep existing loading and error checks)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center mt-10 text-red-500 font-semibold">Failed to load dashboard data.</div>;
  }

  const pieChartData = {
    labels: ['Completed', 'Active', 'Upcoming'],
    datasets: [
      {
        data: [stats.completed_elections, stats.active_elections, stats.upcoming_elections],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderColor: ['#059669', '#2563eb', '#d97706'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: trendType === "monthly" ? stats.voting_trend.months : stats.voting_trend.hours,
    datasets: [
      {
        label: 'Votes Cast',
        data: trendType === "monthly" ? stats.voting_trend.vote_counts : stats.voting_trend.hourly_vote_counts,
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1
      },
    ],
  };

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold">Total Elections</h2>
          <p className="text-2xl md:text-3xl font-bold">{stats.total_elections}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold">Active Elections</h2>
          <p className="text-2xl md:text-3xl font-bold">{stats.active_elections}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold">Total Candidates</h2>
          <p className="text-2xl md:text-3xl font-bold">{stats.total_candidates}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold">Total Votes</h2>
          <p className="text-2xl md:text-3xl font-bold">{stats.total_votes}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Election Statistics</h3>
          <Bar
            data={{
              labels: ["Elections", "Active Elections", "Candidates", "Votes"],
              datasets: [
                {
                  label: "Election Statistics",
                  data: [
                    stats.total_elections,
                    stats.active_elections,
                    stats.total_candidates,
                    stats.total_votes,
                  ],
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Election Status</h3>
          <div className="h-64">
            <Pie 
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Voting Trends</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTrendType("monthly")} 
              className={`px-4 py-2 rounded-md text-white ${trendType === "monthly" ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setTrendType("hourly")} 
              className={`px-4 py-2 rounded-md text-white ${trendType === "hourly" ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"}`}
            >
              Hourly
            </button>
          </div>
        </div>
        <Line 
          data={lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: trendType === "monthly" ? "Monthly Voting Activity" : "Hourly Voting Activity"
              }
            }
          }}
        />
      </div>

      {/* Keep the existing Recent Elections and Recent Activity sections */}
      {/* ... */}
    </>
  );

  // ... (keep the rest of the component as is)

  const renderElections = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
     
      
      <AdminElectionsList />
    
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg ${activeTab === "overview" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("elections")}
            className={`px-4 py-2 rounded-lg ${activeTab === "elections" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Elections
          </button>
        </nav>
      </div>

      {activeTab === "overview" && renderOverview()}
      {activeTab === "elections" && renderElections()}
    </div>
  );
};

export default AdminDashboard;
