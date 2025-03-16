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
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await axios.get(API_URL);
        setStats(statsResponse.data);
        
        setRecentElections([
          { id: 1, name: "SAC General Elections", status: "active", startDate: "2025-03-10", endDate: "2025-03-20", voterCount: 1200 },
          { id: 2, name: "Cultural Council Elections", status: "upcoming", startDate: "2025-04-05", endDate: "2025-04-15", voterCount: 0 },
          { id: 3, name: "Hostel Representatives", status: "completed", startDate: "2025-02-01", endDate: "2025-02-10", voterCount: 850 }
        ]);
        
        setRecentActivity([
          { id: 1, action: "New candidate added", election: "SAC General Elections", timestamp: "2025-03-15 14:30" },
          { id: 2, action: "Position modified", election: "Cultural Council Elections", timestamp: "2025-03-14 11:20" },
          { id: 3, action: "Election created", election: "Hostel Representatives", timestamp: "2025-03-10 09:45" },
          { id: 4, action: "Vote recorded", election: "SAC General Elections", timestamp: "2025-03-15 16:12" }
        ]);

        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditCandidate = (id) => {
    console.log("Edit candidate with id:", id);
  };

  const handleDeleteCandidate = (id) => {
    console.log("Delete candidate with id:", id);
  };

  const handleAddCandidate = () => {
    console.log("Add new candidate");
  };

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
        data: [5, 2, 3],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderColor: ['#059669', '#2563eb', '#d97706'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Votes Cast',
        data: [450, 590, 800, 810, 560, 550],
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
        <h3 className="text-lg font-semibold mb-4">Voting Trends</h3>
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
                text: 'Monthly Voting Activity'
              }
            }
          }}
        />
      </div>
     

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Elections</h3>
            <Link to="/admin/elections" className="text-blue-500 hover:underline text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Date Range</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentElections.map(election => (
                  <tr key={election.id} className="border-b">
                    <td className="py-2 px-3">{election.name}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        election.status === 'active' ? 'bg-green-100 text-green-800' :
                        election.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {election.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm">{election.startDate} to {election.endDate}</td>
                    <td className="py-2 px-3">
                      <Link to={`/admin/elections/${election.id}/edit`} className="text-blue-500 hover:underline text-sm mr-2">Edit</Link>
                      <Link to={`/admin/elections/${election.id}/positions`} className="text-green-500 hover:underline text-sm">Positions</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivity.map(activity => (
              <li key={activity.id} className="border-b pb-2">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">{activity.action}</span> - {activity.election}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

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
