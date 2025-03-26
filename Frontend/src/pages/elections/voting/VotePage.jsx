import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import authService from '../../../services/auth';
import { decodeVoterEmail } from "../utils/decodeVoter";

const API_URL = "http://localhost:8000/";

const VotePage = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();

    const [election, setElection] = useState(null);
    const [positions, setPositions] = useState([]);
    const [eligiblePositions, setEligiblePositions] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [voterInfo, setVoterInfo] = useState(null);

    // Get user from authService
    // const user = authService.getUserFromCookie();
    const user = useMemo(() => authService.getUserFromCookie(), []);
    useEffect(() => {
        const fetchVoterInfo = async () => {
            if (!user || !user.email) return;

            try {
                console.log("Fetching voter details for:", user.email);
                const response = await axios.get(`${API_URL}api/voter-details/`, {
                    params: { email: user.email }, // Send email as query param
                    withCredentials: true, // Ensure authentication
                });

                console.log("Voter Info from Backend:", response.data);
                setVoterInfo(response.data);
            } catch (error) {
                console.error("Error fetching voter details:", error.response?.data || error.message);
                setVoterInfo(null);
            }
        };

        fetchVoterInfo();
    }, [user]);

    useEffect(() => {
        if (!user) {
            console.error("User not authenticated");
            navigate('/login', { state: { from: `/vote/${electionId}` } });
            return;
        }

        // Get and decode voter information
        if (user && user.email) {
            const decodedVoterInfo = decodeVoterEmail(user.email);
            console.log("Decoded Voter Info:", decodedVoterInfo);
            // setVoterInfo(decodedVoterInfo);
        }
        else {
            console.error("User not authenticated decodded");
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

    //    // Filter positions based on user eligibility once we have both positions and voter info
    // useEffect(() => {
    //     if (positions.length > 0 && voterInfo) {
    //         const eligible = positions.filter(position => {
    //             // If the position allows "All Branches", allow all users
    //             const branchEligible = position.branch_restriction.includes("All Branches") || 
    //                 position.branch_restriction.includes(voterInfo.Department);

    //             // Skip batch check for PhD, MTech, MSc; otherwise, check batch restriction
    //             const batchEligible = ["PHD", "MTech", "MSC"].includes(voterInfo.Department) || 
    //                 position.batch_restriction.includes("All Batches") || 
    //                 position.batch_restriction.includes(voterInfo.status);

    //             return batchEligible && branchEligible;
    //         });

    //         console.log("Eligible Positions:", eligible);
    //         setEligiblePositions(eligible);
    //     }
    // }, [positions, voterInfo]);

    useEffect(() => {
        if (positions.length > 0 && voterInfo) {
            const eligible = positions.filter(position => {
                // Check degree restriction first
                const degreeEligible = position.degree_restriction.length === 0 ||
                    position.degree_restriction.includes(voterInfo.degree);

                // For B.Tech degrees, also check batch and branch
                if (voterInfo.degree.includes('B.Tech')) {
                    const branchEligible = position.branch_restriction.includes("All Branches") ||
                        position.branch_restriction.includes(voterInfo.Department);

                    const batchEligible = position.batch_restriction.includes("All Batches") ||
                        position.batch_restriction.includes(voterInfo.status);

                    return degreeEligible && branchEligible && batchEligible;
                }

                // For other degrees, just check degree
                return degreeEligible;
            });

            console.log("Eligible Positions:", eligible);
            setEligiblePositions(eligible);
        }
    }, [positions, voterInfo]);

    const handleVote = () => {
        if (!user) {
            setMessage("❌ You must be logged in to vote.");
            return;
        }

        // Ensure all eligible positions are voted for
        const requiredPositions = eligiblePositions.length;
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
            const position = eligiblePositions.find(pos => pos.id.toString() === positionId);
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

    // Show message if user is not eligible for any positions
    if (eligiblePositions.length === 0 && voterInfo) {
        return (
            <div className="container mx-auto p-4 md:p-6 max-w-4xl">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-center mb-2">{election?.title || 'Vote for Candidates'}</h1>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-6 rounded">
                        <p className="font-medium">You are not eligible to vote in this election.</p>
                        <p className="mt-2">You don't meet the eligibility criteria for any positions in this election.</p>
                        <div className="mt-4 text-sm">
                            <p>Your details:</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Degree: {voterInfo.degree}</li>
                                <li>Department: {voterInfo.Department}</li>
                                <li>Year: {voterInfo.status}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
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

                {/* {voterInfo && positions.length !== eligiblePositions.length && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 text-sm">
                        <p className="font-medium">Note: Some positions are not displayed because you don't meet their eligibility criteria.</p>
                        <p className="mt-1">You are only shown positions you are eligible to vote for .</p>
                    </div>
                )} */}

                <div className="space-y-6">
                    {eligiblePositions.map((position) => (
                        <div key={position.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b">
                                <h2 className="text-xl font-semibold">{position.title}</h2>
                                <p className="text-sm text-gray-600">Select one candidate for this position</p>
                                {(position.degree_restriction.length > 0 ||
                                    position.batch_restriction.length > 0 ||
                                    position.branch_restriction.length > 0) && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            <span className="font-medium">Eligibility: </span>
                                            {position.degree_restriction.length > 0 && (
                                                <span className="mr-2">Degree: {position.degree_restriction.join(', ')}</span>
                                            )}
                                            {position.batch_restriction.length > 0 && (
                                                <span className="mr-2">Year: {position.batch_restriction.join(', ')}</span>
                                            )}
                                            {position.branch_restriction.length > 0 && (
                                                <span>Department: {position.branch_restriction.join(', ')}</span>
                                            )}
                                        </div>
                                    )}
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
                        disabled={submitting || Object.keys(selectedCandidates).length === 0 || Object.keys(selectedCandidates).length < eligiblePositions.length}
                        className={`px-6 py-3 rounded-md text-white transition-colors ${submitting ? 'bg-blue-400 cursor-not-allowed' :
                                Object.keys(selectedCandidates).length === 0 || Object.keys(selectedCandidates).length < eligiblePositions.length ? 'bg-blue-300 cursor-not-allowed' :
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
                        ) : 'Next'}
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