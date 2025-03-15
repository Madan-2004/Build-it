import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const VotingConfirmationPage = ({ selectedVotes, setSelectedVotes }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Submit vote to backend
  const handleConfirmVote = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedVotes.map((vote) =>
          axios.post(`${API_URL}votes/`, { candidate: vote.candidateId })
        )
      );
      alert("Your vote has been successfully submitted!");
      setSelectedVotes([]); // Clear selected votes
      navigate("/elections"); // Redirect to elections page
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit your vote. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Confirm Your Vote
        </h1>

        {selectedVotes.length === 0 ? (
          <p className="text-center text-gray-500">
            No candidates selected. Go back and choose your candidates.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="p-3 border">Position</th>
                <th className="p-3 border">Candidate Name</th>
                <th className="p-3 border">Degree</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Department</th>
              </tr>
            </thead>
            <tbody>
              {selectedVotes.map((vote, index) => (
                <tr key={index} className="hover:bg-blue-100">
                  <td className="p-3 border">{vote.position}</td>
                  <td className="p-3 border">{vote.candidateName}</td>
                  <td className="p-3 border">{vote.degree}</td>
                  <td className="p-3 border">{vote.rollNumber}</td>
                  <td className="p-3 border">{vote.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirmVote}
            className={`px-6 py-3 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm Vote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingConfirmationPage;
