import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import authService from '../../../services/auth';

const API_URL = "http://localhost:8000/";

const VotePage = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();

    const [election, setElection] = useState(null);
    const [positions, setPositions] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Get user from authService
    const user = authService.getUserFromCookie();

    useEffect(() => {
        if (!user) {
            console.error("User not authenticated");
            navigate('/login', { state: { from: `/vote/${electionId}` } });
            return;
        }
        
        // Fetch election details
        axios.get(`${API_URL}api/elections/${electionId}/`, {
            withCredentials: true
        })
        .then((response) => {
            setElection(response.data);
        })
        .catch((error) => {
            console.error("Error fetching election details:", error);
            setMessage("❌ Could not load election details");
        });

        // Fetch positions with candidates
        axios.get(`${API_URL}api/elections/${electionId}/positions/`, {
            withCredentials: true
        })
        .then((response) => {
            setPositions(response.data);
            console.log("Fetched Positions:", response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching positions:", error);
            setMessage("❌ Could not load voting information");
            setLoading(false);
        });
    }, []);

    // const handleVote = () => {
    //     if (!user) {
    //         setMessage("❌ You must be logged in to vote.");
    //         return;
    //     }

    //     // Count required positions vs selected positions
    //     const requiredPositions = positions.length;
    //     const selectedPositions = Object.keys(selectedCandidates).length;

    //     if (selectedPositions === 0) {
    //         setMessage("❌ Please select at least one candidate before voting.");
    //         return;
    //     }

    //     if (selectedPositions < requiredPositions) {
    //         if (!window.confirm(`You've only voted for ${selectedPositions} out of ${requiredPositions} positions. Continue anyway?`)) {
    //             return;
    //         }
    //     }

    //     const votes = Object.entries(selectedCandidates).map(([positionId, candidateId]) => ({
    //         position: positionId,
    //         candidate: candidateId,
    //         election: electionId
    //     }));

    //     console.log("Submitting Votes:", votes);
    //     setSubmitting(true);

    //     axios.post(`${API_URL}api/votes/`, votes, {
    //         withCredentials: true
    //     })
    //     .then((response) => {
    //         setMessage("✅ Vote submitted successfully!");
    //         // Redirect to confirmation page after short delay
    //         setTimeout(() => {
    //             navigate('/vote-confirmation', { 
    //                 state: { 
    //                     electionName: election?.title,
    //                     positions: positions.filter(p => 
    //                         Object.keys(selectedCandidates).includes(p.id.toString())
    //                     )
    //                 } 
    //             });
    //         }, 1500);
    //     })
    //     .catch((error) => {
    //         const errorMessage = error.response?.data?.error || error.response?.data?.detail || error.message;
    //         setMessage(`❌ ${errorMessage}`);
    //     })
    //     .finally(() => {
    //         setSubmitting(false);
    //     });
    // };
    const handleVote = () => {
        if (!user) {
            setMessage("❌ You must be logged in to vote.");
            return;
        }
    
        // Ensure all positions are voted for
        const requiredPositions = positions.length;
        const selectedPositions = Object.keys(selectedCandidates).length;
    
        if (selectedPositions === 0) {
            toast.error("❌ Please select at least one candidate before voting.");
            return;
        }
    
        if (selectedPositions < requiredPositions) {
            toast.error(`❌ You must vote for all ${requiredPositions} positions before submitting.`);
            return;
        }
    
        // Convert selected candidates into vote objects
        const selectedVotes = Object.entries(selectedCandidates).map(([positionId, candidateId]) => {
            const position = positions.find(pos => pos.id.toString() === positionId);
            const candidate = position?.candidates.find(c => c.id === candidateId);
    
            return {
                positionId,
                positionTitle: position?.title || "Unknown",
                candidateId,
                candidateName: candidate?.name || "Unnamed Candidate",
                degree: candidate?.degree || "N/A",
                rollNumber: candidate?.roll_no || "Unknown",
                department: candidate?.Department || "Unknown"
            };
        });
    
        console.log("Navigating to Confirmation Page with Votes:", selectedVotes);
    
        // Navigate to confirmation page with selected votes
        navigate('/vote-confirmation', {
            state: { selectedVotes, electionName: election?.title }
        });
    };
    

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-center mb-2">{election?.title || 'Vote for Candidates'}</h1>
                {election && (
                    <p className="text-center text-gray-600 mb-4">
                        Election Period: {new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}
                    </p>
                )}

                {message && (
                    <div className={`p-4 rounded-md text-center font-semibold mb-6 ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    {positions.map((position) => (
                        <div key={position.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b">
                                <h2 className="text-xl font-semibold">{position.title}</h2>
                                <p className="text-sm text-gray-600">Select one candidate for this position</p>
                            </div>
                            
                            <div className="p-4">
                                {position.candidates.length === 0 ? (
                                    <p className="text-gray-500 italic">No candidates available for this position.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {position.candidates
                                            .filter(candidate => candidate.approved)
                                            .map((candidate) => (
                                                <label 
                                                    key={candidate.id}
                                                    className={`block relative cursor-pointer rounded-lg border ${selectedCandidates[position.id] === candidate.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex p-4 items-center">
                                                        <div className="mr-4">
                                                            <input
                                                                type="radio"
                                                                name={`position-${position.id}`}
                                                                value={candidate.id}
                                                                checked={selectedCandidates[position.id] === candidate.id}
                                                                onChange={() => setSelectedCandidates({
                                                                    ...selectedCandidates,
                                                                    [position.id]: candidate.id,
                                                                })}
                                                                className="h-5 w-5 text-blue-600 cursor-pointer"
                                                            />
                                                        </div>
                                                        
                                                        <div className="flex flex-1 items-center">
                                                            {candidate.photo ? (
                                                                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border border-gray-200">
                                                                    <img 
                                                                        src={`${API_URL}${candidate.photo}`} 
                                                                        alt={candidate.name} 
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = '/placeholder-profile.png';
                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                                                    <span className="text-gray-500 text-xl font-semibold">
                                                                        {(candidate.name || '').charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-lg">
                                                                    {candidate.name || candidate.user_email || 'Unnamed Candidate'}
                                                                </h3>
                                                                <div className="text-sm text-gray-600 space-y-1">
                                                                    <p>Roll No: {candidate.roll_no}</p>
                                                                    <div className="flex space-x-4">
                                                                        <span className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                                                            {candidate.degree}
                                                                        </span>
                                                                        <span className="inline-block bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                                                                            {candidate.Department}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        onClick={handleVote}
                        disabled={submitting || Object.keys(selectedCandidates).length === 0}
                        className={`px-6 py-3 rounded-md text-white transition-colors ${
                            submitting ? 'bg-blue-400 cursor-not-allowed' : 
                            Object.keys(selectedCandidates).length === 0 ? 'bg-blue-300 cursor-not-allowed' : 
                            'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting Vote...
                            </span>
                        ) : 'Submit Vote'}
                    </button>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
                <p>If you experience any issues while voting, please contact the election administrator.</p>
            </div>
        </div>
    );
};

export default VotePage;