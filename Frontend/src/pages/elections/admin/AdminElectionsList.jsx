import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Info, Edit, Trash2, Plus, Award, Users,BarChart2 } from "lucide-react";

const API_URL = "http://localhost:8000/api/";

const AdminElectionsList = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });
  const [expandedCategory, setExpandedCategory] = useState("ongoing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_elections: 0,
    active_elections: 0,
    total_positions: 0,
    total_candidates: 0
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = () => {
    setLoading(true);
    axios
      .get(`${API_URL}elections/`, {
        withCredentials: true
      })
      .then((response) => {
        const categorizedElections = { 
          ongoing: [], 
          upcoming: [], 
          past: [] 
        };
        
        console.log("Fetched Elections:", response.data);
        response.data.forEach((election) => {
          if (election.is_active) {
            categorizedElections.ongoing.push(election);
          } else if (election.is_upcoming) {
            categorizedElections.upcoming.push(election);
          } else if (election.is_completed) {
            categorizedElections.past.push(election);
          }
        });
        
        setElections(categorizedElections);
        
        // Update stats
        setStats({
          total_elections: response.data.length,
          active_elections: categorizedElections.ongoing.length,
          total_positions: response.data.reduce((total, election) => total + (election.positions.length || 0), 0),
          total_candidates: response.data.reduce((total, election) => total + (election.candidates_count || 0), 0)
        });
        
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching elections:", error);
        setError("Failed to load elections. Please try again.");
        setLoading(false);
      });
  };

  const handleDelete = (id, electionTitle) => {
    if (window.confirm(`Are you sure you want to delete the election "${electionTitle}"? This action cannot be undone.`)) {
      axios.delete(`${API_URL}elections/${id}/`, {
          withCredentials: true
        })
        .then(() => {
          setElections((prev) => ({
            ongoing: prev.ongoing.filter((e) => e.id !== id),
            upcoming: prev.upcoming.filter((e) => e.id !== id),
            past: prev.past.filter((e) => e.id !== id),
          }));
          alert("Election deleted successfully!");
        })
        .catch((error) => {
          console.log("Error deleting election:", error);
          alert("Failed to delete election. Please try again.");
        });
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "ongoing":
        return <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>;
      case "upcoming":
        return <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>;
      case "past":
        return <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>;
      default:
        return null;
    }
  };

  const getCategoryCount = (category) => {
    return elections[category]?.length || 0;
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading elections...</p>
        </div>
      </div>
    );
  }

 
return (
  <div className="p-6 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto">
      {/* Header section */}
      <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Election Management</h1>
          <Link
            to="/admin/elections/create"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-blue-700 transition duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Election
          </Link>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Elections</p>
            <p className="text-2xl font-bold">{stats.total_elections}</p>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Elections</p>
            <p className="text-2xl font-bold">{stats.active_elections}</p>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Positions</p>
            <p className="text-2xl font-bold">{stats.total_positions}</p>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Candidates</p>
            <p className="text-2xl font-bold">{stats.total_candidates}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              className="ml-4 text-blue-600 hover:underline" 
              onClick={fetchElections}
            >
              Try Again
            </button>
          </div>
        )}

        {["ongoing", "upcoming", "past"].map((category) => (
          <div key={category} className="mb-6 border rounded-lg overflow-hidden">
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${
                expandedCategory === category ? 'bg-gray-100 border-b' : 'bg-white'
              }`}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-semibold capitalize">{category} Elections</h2>
                <span className="ml-2 bg-gray-200 text-gray-700 text-sm px-2 py-0.5 rounded-full">
                  {getCategoryCount(category)}
                </span>
              </div>
              {expandedCategory === category ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expandedCategory === category && (
              <div className="p-4">
                {elections[category].length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No {category} elections found.</p>
                    {category === "upcoming" && (
                      <Link
                        to="/admin/elections/create"
                        className="mt-2 text-blue-600 hover:underline inline-block"
                      >
                        Create a new election
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left">Election Name</th>
                          <th className="p-3 text-left">Start Date</th>
                          <th className="p-3 text-left">End Date</th>
                          <th className="p-3 text-center">Positions</th>
                          <th className="p-3 text-center">Candidates</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {elections[category].map((election) => (
                          <tr key={election.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{election.title}</td>
                            <td className="p-3">{formatDate(election.start_date)}</td>
                            <td className="p-3">{formatDate(election.end_date)}</td>
                            <td className="p-3 text-center">{election.positions.length || 0}</td>
                            <td className="p-3 text-center">{election.candidates_count || 0}</td>
                            <td className="p-3">
                              <div className="flex justify-center space-x-2">
                                <Link
                                  to={`/elections/${election.id}/results`}
                                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                  title="View Results"
                                >
                                  <BarChart2 className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={`/admin/elections/${election.id}/positions`}
                                  className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition-colors"
                                  title="View Details"
                                >
                                  <Info className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={`/admin/elections/${election.id}/edit`}
                                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                                  title="Edit Election"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(election.id, election.title)}
                                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                  title="Delete Election"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default AdminElectionsList;