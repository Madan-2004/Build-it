import React, { useState } from 'react';

// Dummy candidates data (this will be dynamic based on the selected election)
const dummyCandidates = [
  { role: 'President', candidates: ['Alice', 'Bob'] },
  { role: 'Secretary', candidates: ['Charlie', 'Dave'] },
  { role: 'Treasurer', candidates: ['Eve', 'Frank'] },
];

const VotingPage = ({ match }) => {
  const { electionId } = match?.params; // Getting election ID from the URL
  const [selectedVotes, setSelectedVotes] = useState({});

  const handleVoteChange = (role, candidate) => {
    setSelectedVotes({ ...selectedVotes, [role]: candidate });
  };

  const handleSubmitVotes = () => {
    // Here, you would send the votes to the server
    console.log('Votes Submitted for Election:', electionId, selectedVotes);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Voting for Election {electionId}</h1>
      {dummyCandidates.map((roleData) => (
        <div key={roleData.role} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{roleData.role}</h3>
          <select
            value={selectedVotes[roleData.role] || ''}
            onChange={(e) => handleVoteChange(roleData.role, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a candidate</option>
            {roleData.candidates.map((candidate, index) => (
              <option key={index} value={candidate}>
                {candidate}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        onClick={handleSubmitVotes}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        Submit Vote
      </button>
    </div>
  );
};

export default VotingPage;
