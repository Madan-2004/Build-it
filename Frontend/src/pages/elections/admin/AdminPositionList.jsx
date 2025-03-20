import { useEffect, useState } from "react";
import axios from "axios";
import AddPositionForm from "./AddPositionForm";
import EditPositionForm from "./EditPositionForm";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Trash2, Users, ArrowLeft, Plus, Award } from "lucide-react";

const API_URL = "http://localhost:8000/api/";

const AdminPositionList = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPosition, setEditingPosition] = useState(null);
  const [electionInfo, setElectionInfo] = useState(null);
  const { electionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchElectionInfo();
    fetchPositions();
  }, [electionId]);

  const fetchElectionInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}elections/${electionId}/`, 
        { withCredentials: true }
      );
      setElectionInfo(response.data);
    } catch (error) {
      console.error("Error fetching election info:", error);
    }
  };

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}elections/${electionId}/positions/`, 
        { withCredentials: true }
      );
      console.log("Fetched Positions:", response.data);
      setPositions(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching positions:", error);
      setError("Failed to load positions. Please try again.");
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (positionId, positionTitle) => {
    if (!window.confirm(`Are you sure you want to delete the position "${positionTitle}"? This will also delete all candidates for this position.`)) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}elections/${electionId}/positions/${positionId}/`, 
        { withCredentials: true }
      );
      toast.success("Position deleted successfully");
      fetchPositions();
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Error deleting position");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
  };

  const handleCancelEdit = () => {
    setEditingPosition(null);
  };

  const handlePositionUpdated = () => {
    setEditingPosition(null);
    fetchPositions();
  };

  if (loading && positions.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading positions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with election info */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <button 
                onClick={() => navigate('/admin/elections')}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Elections
              </button>
              <h1 className="text-2xl font-bold">
                {electionInfo ? electionInfo.title : 'Election'} Positions
              </h1>
              {electionInfo && (
                <p className="text-gray-600 mt-1">
                  {new Date(electionInfo.start_date).toLocaleDateString()} - {new Date(electionInfo.end_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link
              to={`/admin/elections/${electionId}/positions/add`}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200 mt-2 md:mt-0"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Position
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center border-r pr-4">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Positions</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center pl-4">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Candidates</p>
                <p className="text-2xl font-bold">
                {positions.reduce((total, position) => total + position.candidates.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
              <span>{error}</span>
              <button 
                className="text-blue-600 hover:underline" 
                onClick={fetchPositions}
              >
                Try Again
              </button>
            </div>
          )}

          {editingPosition ? (
            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
              <h3 className="text-lg font-medium mb-4">Edit Position</h3>
              <EditPositionForm 
                position={editingPosition} 
                onPositionUpdated={handlePositionUpdated}
                onCancel={handleCancelEdit}
                electionId={electionId}
              />
            </div>
          ) : null}

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Candidates</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Award className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="mb-4">No positions found.</p>
                        <Link
                          to={`/admin/elections/${electionId}/positions/add`}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Add your first position
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => (
                    <tr key={position.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{position.title}</td>
                      <td className="p-3 text-gray-600">
                        {position.description 
                          ? position.description.substring(0, 50) + (position.description.length > 50 ? "..." : "") 
                          : "No description"}
                      </td>
                      
                      <td className="p-3 text-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {position.candidates.length| 0}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/admin/elections/${electionId}/positions/${position.id}/candidates`}
                            className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition-colors"
                            title="View Candidates"
                          >
                            <Users className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => handleEdit(position)} 
                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                            title="Edit Position"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(position.id, position.title)} 
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                            disabled={loading}
                            title="Delete Position"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPositionList;