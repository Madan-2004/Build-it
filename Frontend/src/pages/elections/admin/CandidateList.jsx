import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API_URL = "http://localhost:8000/api/";

const CandidateList = () => {
  const {electionId, positionId } = useParams(); // Get position ID from URL
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidates for this position
  useEffect(() => {
    axios
      .get(`${API_URL}positions/${positionId}/candidates/`)
      .then((response) => {
        setCandidates(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching candidates:", error));
  }, [positionId]);

  const toggleApproval = async (candidateId, approved) => {
    try {
      await axios.patch(`${API_URL}candidates/${candidateId}/`, {
        approved: !approved,
      });
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c.id === candidateId ? { ...c, approved: !approved } : c
        )
      );
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Candidates</h1>

        {candidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="p-3 border">Photo</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Degree</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Approved</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-blue-100">
                  <td className="p-3 border text-center">
                    {candidate.photo ? (
                      <img
                        src={candidate.photo}
                        alt="Candidate"
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3 border">{candidate.name || "N/A"}</td>
                  <td className="p-3 border">{candidate.degree}</td>
                  <td className="p-3 border">{candidate.roll_number}</td>
                  <td className="p-3 border">{candidate.department}</td>
                  <td className="p-3 border text-center">
                    {candidate.approved ? "✅ Approved" : "❌ Pending"}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => toggleApproval(candidate.id, candidate.approved)}
                      className={`px-4 py-2 rounded ${
                        candidate.approved
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white`}
                    >
                      {candidate.approved ? "Reject" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 text-center">
          <Link
            to={`/admin/elections/${electionId}/positions/${positionId}/candidates/add`}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Add Candidate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
