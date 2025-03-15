import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../../services/auth';
// Import authentication service

const API_URL = "http://localhost:8000/";

const VotePage = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();

    const [positions, setPositions] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // 🔹 Get user from authService
    const user = authService.getUserFromCookie();  
    console.log("Logged-in User:", user);  // ✅ Debug: Print user info

    useEffect(() => {
        if (!user) {
            console.error("User not authenticated");
            navigate('/login');  // 🔥 Redirect to login if not authenticated
            return;
        }
        
        axios.get(`${API_URL}api/elections/${electionId}/positions/`, {
            withCredentials: true  // ✅ Send cookies with the request
        })
        .then((response) => {
            setPositions(response.data);
            console.log("Fetched Positions:", response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching positions:", error);
            setLoading(false);
        });
    }, []);

    const handleVote = () => {
        if (!user) {
            setMessage("❌ You must be logged in to vote.");
            return;
        }

        const votes = Object.entries(selectedCandidates).map(([positionId, candidateId]) => ({
            candidate: candidateId,
        }));

        axios.post(`${API_URL}api/votes/`, votes, {
            withCredentials: true // ✅ Send auth token in request
        })
        .then(() => setMessage("✅ Vote submitted successfully!"))
        .catch((error) => setMessage("❌ Error submitting vote: " + (error.response?.data?.detail || error.message)));
    };

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Vote for Candidates</h1>

            {message && (
                <p className={`text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}

            {positions.map((position) => (
                <div key={position.id} className="border p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-xl font-semibold">{position.title}</h2>
                    {position.candidates.length === 0 ? (
                        <p className="text-gray-500">No candidates available.</p>
                    ) : (
                        position.candidates.map((candidate) => (
                            <label key={candidate.id} className="block cursor-pointer flex items-center gap-2 p-2 border rounded hover:bg-gray-100">
                                <input
                                    type="radio"
                                    name={`position-${position.id}`}
                                    value={candidate.id}
                                    onChange={() => setSelectedCandidates({
                                        ...selectedCandidates,
                                        [position.id]: candidate.id,
                                    })}
                                />
                                {candidate.name || candidate.user_email} ({candidate.degree})
                            </label>
                        ))
                    )}
                </div>
            ))}

            <button 
                onClick={handleVote} 
                className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-800 transition"
            >
                Submit Vote
            </button>
        </div>
    );
};

export default VotePage;
