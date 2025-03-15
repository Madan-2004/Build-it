import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000/api/";

const AdminElectionsList = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });

  useEffect(() => {
    axios
      .get(`${API_URL}elections/`, {
        withCredentials: true  // Include cookies
      })
      .then((response) => {
        const categorizedElections = { 
          ongoing: [], 
          upcoming: [], 
          past: [] 
        };
        const currentDate = new Date();
        
        
        console.log("Fetched Elections:", response.data);
        response.data.forEach((election) => {
          // Use the server's categorization
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
      .catch((error) => console.log("Error fetching elections:", error));
  }, []);
  const handleDelete = (id) => {
    axios.delete(`${API_URL}elections/${id}/`, {
        withCredentials: true  // Add this line to include cookies
      })
      .then(() => {
        setElections((prev) => ({
          ongoing: prev.ongoing.filter((e) => e.id !== id),
          upcoming: prev.upcoming.filter((e) => e.id !== id),
          past: prev.past.filter((e) => e.id !== id),
        }));
      })
      .catch((error) => console.log("Error deleting election:", error));
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats the date as MM/DD/YYYY, HH:MM AM/PM
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Elections</h1>

        <div className="flex justify-end mb-4">
          <Link
            to="/admin/elections/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Create Election
          </Link>
        </div>

        {["ongoing", "upcoming", "past"].map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-xl font-semibold capitalize">{category} Elections</h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border">Election Name</th>
                  <th className="p-3 border">Start Date</th>
                  <th className="p-3 border">End Date</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections[category].map((election) => (
                  <tr key={election.id} className="hover:bg-gray-100">
                    <td className="p-3 border">{election.title}</td>
                    <td className="p-3 border">{formatDate(election.start_date)}</td>
                    <td className="p-3 border">{formatDate(election.end_date)}</td>
                    <td className="p-3 border text-center">
                      <Link
                        to={`/admin/elections/${election.id}/edit`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(election.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {elections[category].length === 0 && (
              <p className="text-gray-500 mt-2">No {category} elections found.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminElectionsList;
