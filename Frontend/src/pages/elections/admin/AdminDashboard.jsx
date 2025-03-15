import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const API_URL = "http://localhost:8000/api/admin/dashboard/stats/";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center mt-10">No data available.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Elections</h2>
            <p className="text-3xl font-bold">{stats.total_elections}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Active Elections</h2>
            <p className="text-3xl font-bold">{stats.active_elections}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Candidates</h2>
            <p className="text-3xl font-bold">{stats.total_candidates}</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Votes</h2>
            <p className="text-3xl font-bold">{stats.total_votes}</p>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="mt-6">
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
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
