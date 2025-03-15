// AdminPositionList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddPositionForm from "./AddPositionForm";
import EditPositionForm from "./EditPositionForm";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const AdminPositionList = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPosition, setEditingPosition] = useState(null);
  const { electionId } = useParams();

  useEffect(() => {
    fetchPositions();
  }, [electionId]);

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

  const handleDelete = async (positionId) => {
    if (!window.confirm("Are you sure you want to delete this position?")) {
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
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Positions</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {editingPosition ? (
        <EditPositionForm 
          position={editingPosition} 
          onPositionUpdated={handlePositionUpdated}
          onCancel={handleCancelEdit}
          electionId={electionId}
        />
      ) : (
        <AddPositionForm electionId={electionId} onPositionAdded={fetchPositions} />
      )}

      <div className="mt-8 overflow-x-auto">
<table className="w-full mt-6 border-collapse border">
  <thead>
    <tr className="bg-gray-200">
      <th className="border p-3">Title</th>
      <th className="border p-3">Description</th>
      <th className="border p-3">Max Candidates</th>
      <th className="border p-3">Max Votes</th>
      <th className="border p-3">Actions</th>
    </tr>
  </thead>
  <tbody>
    {positions.length === 0 ? (
      <tr>
        <td colSpan="5" className="p-3 text-center text-gray-500">
          No positions found. Add your first position above.
        </td>
      </tr>
    ) : (
      positions.map((position) => (
        <tr key={position.id} className="border hover:bg-gray-50">
          <td className="p-3">{position.title}</td>
          <td className="p-3">{position.description ? position.description.substring(0, 50) + (position.description.length > 50 ? "..." : "") : ""}</td>
          <td className="p-3 text-center">{position.max_candidates}</td>
          <td className="p-3 text-center">{position.max_votes_per_voter}</td>
          <td className="p-3 space-x-2">
            <button 
              onClick={() => handleEdit(position)} 
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(position.id)} 
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              disabled={loading}
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
      </div>
    </div>
  );
};

export default AdminPositionList;