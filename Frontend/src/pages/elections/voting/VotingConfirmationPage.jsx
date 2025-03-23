import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const VotingConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedVotes, electionName } = location.state || { selectedVotes: [] };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ Ensure there's at least one vote before confirming
    useEffect(() => {
        if (!selectedVotes || selectedVotes.length === 0) {
            navigate("/vote"); // Redirect back if no votes were selected
        }
    }, [selectedVotes, navigate]);

    // ✅ Submit votes to the backend
    const handleConfirmVote = async () => {
      setLoading(true);
  
      // ✅ Print votes before sending
      const votesToSend = selectedVotes.map(vote => ({
          position: vote.positionId,
          candidate: vote.candidateId
      }));
  
      console.log("🔹 Votes Being Sent to Backend:", JSON.stringify(votesToSend, null, 2));
  
      try {
          const response = await axios.post(`${API_URL}votes/`, votesToSend, { withCredentials: true });
  
          console.log("✅ Vote Submission Response:", response.data);
  
          toast.success(" Your vote has been successfully submitted!", { autoClose: 5000 });

          navigate("/elections"); // Redirect to elections page
      } catch (error) {
          console.error("❌ Error submitting vote:", error);
          const message = error.response?.data?.error || error.response?.data?.detail || "Failed to submit vote.";
          toast.error(`❌ ${message}`, { autoClose: 5000 });
      }
  
      setLoading(false);
  };
  

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Confirm Your Vote</h1>

                {errorMessage && (
                    <div className="p-4 text-red-700 bg-red-100 rounded-md text-center mb-4">{errorMessage}</div>
                )}

                <p className="text-center text-gray-500 mb-4">Election: <strong>{electionName}</strong></p>

                {selectedVotes.length === 0 ? (
                    <p className="text-center text-gray-500">No candidates selected. Go back and choose your candidates.</p>
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
                                    <td className="p-3 border">{vote.positionTitle}</td>
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
                        className={`px-6 py-3 rounded-lg text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
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
