// AddPositionForm.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {  useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate


const API_URL = "http://localhost:8000/api/";

const AddPositionForm = () => {
  const { electionId } = useParams(); 
  console.log("Election ID:", electionId);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxCandidates, setMaxCandidates] = useState(1);
  const [maxVotes, setMaxVotes] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMaxCandidates(1);
    setMaxVotes(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validation
    if (maxCandidates < 1) {
      toast.error("Maximum candidates must be at least 1");
      setIsSubmitting(false);
      return;
    }

    if (maxVotes < 1) {
      toast.error("Maximum votes must be at least 1");
      setIsSubmitting(false);
      return;
    }

    const newPosition = {
      election: electionId,
      title,
      description,
      max_candidates: parseInt(maxCandidates),  // Ensure integers
      max_votes_per_voter: parseInt(maxVotes),  // Ensure integers
    };

    try {
      console.log("Adding position:", newPosition);
      await axios.post(
        `${API_URL}elections/${electionId}/positions/`, 
        newPosition,
        { withCredentials: true }
      );
      toast.success("Position added successfully!");
      resetForm();
      navigate(`/admin/elections/${electionId}/positions`)
      // onPositionAdded();
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