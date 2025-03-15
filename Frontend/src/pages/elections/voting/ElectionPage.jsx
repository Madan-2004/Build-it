import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const ElectionPage = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });
  const [error, setError] = useState(null); // To manage errors


  useEffect(() => {
    axios
      .get(`${API_URL}elections/`, { withCredentials: true }) // Include cookies
      .then((response) => {
        const categorizedElections = { 
          ongoing: [], 
          upcoming: [], 
          past: [] 
        };
        const currentDate = new Date();
        
        console.log("Fetched Elections:", response.data);
        response.data.forEach((election) => {
          // Categorize elections based on flags
          if (election.is_active) {
            categorizedElections.ongoing.push(election);
          } else if (election.is_upcoming) {
            categorizedElections.upcoming.push(election);
          } else if (election.is_completed) {
            categorizedElections.past.push(election);
          }
        });

        setElections(categorizedElections);
      })
      .catch((error) => {
        console.log("Error fetching elections:", error);
        setError("An error occurred while fetching the elections. Please try again later.");
      });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Elections</h1>

        {/* Error message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Ongoing Elections */}
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Ongoing Elections</h2>
        {elections.ongoing.length > 0 ? (
          <ElectionTable elections={elections.ongoing} type="ongoing" />
        ) : (
          <p className="text-gray-500 mb-6">No ongoing elections.</p>
        )}

        {/* Upcoming Elections */}
        <h2 className="text-xl font-semibold mb-4 text-green-600">Upcoming Elections</h2>
        {elections.upcoming.length > 0 ? (
          <ElectionTable elections={elections.upcoming} type="upcoming" />
        ) : (
          <p className="text-gray-500 mb-6">No upcoming elections.</p>
        )}

        {/* Past Elections */}
        <h2 className="text-xl font-semibold mb-4 text-red-600">Past Elections</h2>
        {elections.past.length > 0 ? (
          <ElectionTable elections={elections.past} type="past" />
        ) : (
          <p className="text-gray-500">No past elections.</p>
        )}
      </div>
    </div>
  );
};

// ✅ Reusable Table Component
const ElectionTable = ({ elections, type }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats the date as MM/DD/YYYY, HH:MM AM/PM
  };

  return (
    <table className="w-full border-collapse mb-6">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-3 border">Election Name</th>
          <th className="p-3 border">Start Date</th>
          <th className="p-3 border">End Date</th>
          <th className="p-3 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {elections.map((election) => (
          <tr key={election.id} className="hover:bg-gray-100">
            <td className="p-3 border">{election.title}</td>
            <td className="p-3 border">{formatDate(election.start_date)}</td>
            <td className="p-3 border">{formatDate(election.end_date)}</td>
            <td className="p-3 border text-center">
              {type === "ongoing" ? (
                <Link to={`/vote/${election.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Vote Now
                </Link>
              ) : type === "past" ? (
                <Link to={`/elections/${election.id}/results`} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                  See Results
                </Link>
              ) : (
                <span className="text-gray-500">Not Started</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ElectionPage;
