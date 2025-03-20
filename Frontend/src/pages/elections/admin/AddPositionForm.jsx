import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom"; 

const API_URL = "http://localhost:8000/api/";

const batchOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const branchOptions = [
  "CSE", "MECH", "CIVIL", "EE", "EP", 
  "SSE", "MEMS", "MNC", "MSC", "PHD"
];

const AddPositionForm = () => {
  const { electionId } = useParams(); 
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxCandidates, setMaxCandidates] = useState(1);
  const [maxVotes, setMaxVotes] = useState(1);
  const [batchRestriction, setBatchRestriction] = useState([]);
  const [branchRestriction, setBranchRestriction] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMaxCandidates(1);
    setMaxVotes(1);
    setBatchRestriction([]);
    setBranchRestriction([]);
  };

  const handleCheckboxChange = (value, setter, currentState) => {
    if (currentState.includes(value)) {
      setter(currentState.filter(item => item !== value));  // Remove if already selected
    } else {
      setter([...currentState, value]);  // Add if not selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (maxCandidates < 1 || maxVotes < 1) {
      toast.error("Maximum candidates and votes must be at least 1.");
      setIsSubmitting(false);
      return;
    }

    const newPosition = {
      election: electionId,
      title,
      description,
      max_candidates: maxCandidates,
      max_votes_per_voter: maxVotes,
      batch_restriction: batchRestriction.length ? batchRestriction : ["All Batches"],
      branch_restriction: branchRestriction.length ? branchRestriction : ["All Branches"]
    };

    try {
      console.log("Adding position:", newPosition);
      await axios.post(`${API_URL}elections/${electionId}/positions/`, newPosition, { withCredentials: true });
      toast.success("Position added successfully!");
      resetForm();
      navigate(`/admin/elections/${electionId}/positions`);
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error(error.response?.data?.detail || "Error adding position");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Position</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Position title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Position description"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Max Candidates</label>
            <input
              type="number"
              value={maxCandidates}
              onChange={(e) => setMaxCandidates(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Max Votes per Voter</label>
            <input
              type="number"
              value={maxVotes}
              onChange={(e) => setMaxVotes(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>
        </div>

        {/* Batch Restriction (Multi-select Checkboxes) */}
        <div>
          <label className="block font-medium mb-1">Batch Restriction</label>
          <div className="flex flex-wrap gap-2">
            {batchOptions.map((batch) => (
              <label key={batch} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={batchRestriction.includes(batch)}
                  onChange={() => handleCheckboxChange(batch, setBatchRestriction, batchRestriction)}
                  className="form-checkbox"
                />
                <span>{batch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Branch Restriction (Multi-select Checkboxes) */}
        <div>
          <label className="block font-medium mb-1">Branch Restriction</label>
          <div className="flex flex-wrap gap-2">
            {branchOptions.map((branch) => (
              <label key={branch} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={branchRestriction.includes(branch)}
                  onChange={() => handleCheckboxChange(branch, setBranchRestriction, branchRestriction)}
                  className="form-checkbox"
                />
                <span>{branch}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Position"}
        </button>
      </div>
    </form>
  );
};

export default AddPositionForm;
