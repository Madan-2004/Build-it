import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Trash2, ArrowLeft, Plus, User, CheckCircle, XCircle, Users } from "lucide-react";

const API_URL = "http://localhost:8000/api/";

const CandidateList = () => {
  const { electionId, positionId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [position, setPosition] = useState(null);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    degree: "BTech",
    branch: "CSE",
    photo: null,
  });

  // Fetch candidates for this position
  useEffect(() => {
    fetchData();
  }, [electionId, positionId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch position details
      const positionResponse = await axios.get(
        `${API_URL}elections/${electionId}/positions/${positionId}/`,
        { withCredentials: true }
      );
      setPosition(positionResponse.data);

      // Fetch election details
      const electionResponse = await axios.get(
        `${API_URL}elections/${electionId}/`,
        { withCredentials: true }
      );
      setElection(electionResponse.data);

      // Fetch candidates
      const candidatesResponse = await axios.get(
        `${API_URL}elections/${electionId}/positions/${positionId}/candidates/`,
        { withCredentials: true }
      );
      setCandidates(candidatesResponse.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load candidates. Please try again.");
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (candidateId, approved, name) => {
    try {
      const payload = { 
        approved: !approved, 
        name: name || ""  // ✅ Ensure name is sent, even if empty
      };
  
      console.log("Sending request:", payload);  // ✅ Debugging
  
      await axios.patch(
        `${API_URL}elections/${electionId}/positions/${positionId}/candidates/${candidateId}/`,
        JSON.stringify(payload),  
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
  
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c.id === candidateId ? { ...c, approved: !approved } : c
        )
      );
  
      toast.success(`Candidate ${!approved ? "approved" : "rejected"} successfully`);
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Failed to update approval status");
    }
  };
  
  const handleDelete = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete the candidate "${candidateName}"? This action cannot be undone.`)) {
        return;
    }

    try {
        setLoading(true);
        await axios.delete(
            `${API_URL}elections/${electionId}/positions/${positionId}/candidates/${candidateId}/`,
            { withCredentials: true }
        );

        setCandidates(candidates.filter((c) => c.id !== candidateId));
        toast.success("Candidate deleted successfully");
    } catch (error) {
        console.error("Error deleting candidate:", error);
        toast.error("Failed to delete candidate");
    } finally {
        setLoading(false);
    }
};


  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name || "",
      roll_no: candidate.roll_no || "",
      degree: candidate.degree || "BTech",
      branch: candidate.branch || "CSE",
      // We don't set the photo as it can't be pre-filled in the file input
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("roll_no", formData.roll_no);
      submitData.append("degree", formData.degree);
      submitData.append("branch", formData.branch);
      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      // Update the candidate
      const response = await axios.patch(
        `${API_URL}elections/${electionId}/positions/${positionId}/candidates/${editingCandidate.id}/`,
        submitData,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    

      // Update the local state
      setCandidates(
        candidates.map((c) => (c.id === editingCandidate.id ? response.data : c))
      );
      
      // Reset form
      setEditingCandidate(null);
      setFormData({
        name: "",
        roll_no: "",
        degree: "BTech",
        branch: "CSE",
        photo: null,
      });
      
      toast.success("Candidate updated successfully");
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error("Failed to update candidate");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingCandidate(null);
    setFormData({
      name: "",
      roll_no: "",
      degree: "BTech",
      branch: "CSE",
      photo: null,
    });
  };

  if (loading && candidates.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <button
                onClick={() => navigate(`/admin/elections/${electionId}/positions`)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Positions
              </button>
              <h1 className="text-2xl font-bold">
                {position ? position.title : "Position"} Candidates
              </h1>
              {election && (
                <p className="text-gray-600 mt-1">
                  Election: {election.title}
                </p>
              )}
            </div>
            <Link
              to={`/admin/elections/${electionId}/positions/${positionId}/candidates/add`}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200 mt-2 md:mt-0"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Candidate
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        {editingCandidate && (
          <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Edit Candidate</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Roll Number</label>
                  <input
                    type="text"
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Degree</label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BTech">BTech</option>
                    <option value="MTech">MTech</option>
                    <option value="PHD">PhD</option>
                    <option value="MSC"> MSC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept="image/*"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave blank to keep current photo
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candidates List */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
              <span>{error}</span>
              <button 
                className="text-blue-600 hover:underline" 
                onClick={fetchData}
              >
                Try Again
              </button>
            </div>
          )}

          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Users className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No candidates found</h3>
              <p className="text-gray-500 mb-6">Add candidates to this position to get started</p>
              <Link
                to={`/admin/elections/${electionId}/positions/${positionId}/candidates/add`}
                className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Candidate
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-3 text-left">Photo</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Roll No</th>
                    <th className="p-3 text-left">Degree</th>
                    <th className="p-3 text-left">branch</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {candidate.photo ? (
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-medium">{candidate.name || "N/A"}</td>
                      <td className="p-3">{candidate.roll_no || "N/A"}</td>
                      <td className="p-3">{candidate.degree || "N/A"}</td>
                      <td className="p-3">{candidate.branch || "N/A"}</td>
                      <td className="p-3 text-center">
                        {candidate.approved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-4 w-4 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => toggleApproval(candidate.id, candidate.approved,candidate.name)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              candidate.approved ? "text-red-500" : "text-green-500"
                            }`}
                            title={candidate.approved ? "Reject" : "Approve"}
                          >
                            {candidate.approved ? (
                              <XCircle className="h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(candidate)}
                            className="p-1 rounded text-blue-500 hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(candidate.id, candidate.name)}
                            className="p-1 rounded text-red-500 hover:bg-gray-100"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
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
      </div>
    </div>
  );
};

export default CandidateList;