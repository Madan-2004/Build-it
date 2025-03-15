// EditPositionForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const EditPositionForm = ({ position, onPositionUpdated, onCancel, electionId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxCandidates, setMaxCandidates] = useState(1);
  const [maxVotes, setMaxVotes] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (position) {
      setTitle(position.title || "");
      setDescription(position.description || "");
      setMaxCandidates(position.max_candidates || 1);
      setMaxVotes(position.max_votes_per_voter || 1);
    }
  }, [position]);

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

    const updatedPosition = {
      election: parseInt(electionId),
      title,
      description,
      max_candidates: maxCandidates,
      max_votes_per_voter: maxVotes,
    };
    console.log("Updating position:", updatedPosition);

    try {
      await axios.put(
       `${API_URL}elections/${electionId}/positions/${position.id}/`,
        updatedPosition,
        { withCredentials: true }
      );
      toast.success("Position updated successfully!");
      onPositionUpdated();
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error(error.response?.data?.detail || "Error updating position");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-yellow-300">
      <h2 className="text-xl font-bold mb-4">Edit Position</h2>

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

        <div className="flex space-x-2">
          <button 
            type="submit" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Position"}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPositionForm;