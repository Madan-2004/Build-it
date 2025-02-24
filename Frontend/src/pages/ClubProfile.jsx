import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api"; // Update API URL if needed

const ClubProfile = () => {
  const { clubName } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clubs/${encodeURIComponent(clubName)}/`);
        if (!response.ok) throw new Error("Club not found");
        const data = await response.json();
        setClub(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubName]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!club) return <p className="text-center text-gray-600">No club found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Club Header */}
      <div className="flex items-center gap-6">
        {/* Club Image */}
        <img
          src={club.image || "/placeholder.svg"}
          alt={club.name}
          className="w-36 h-36 object-cover rounded-lg shadow-md"
        />

        {/* Club Name & Description */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{club.name}</h1>
          <p className="text-gray-600 mt-2">{club.description || "No description available."}</p>
        </div>
      </div>

      {/* Head of Club */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Club Head</h2>
        <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-sm flex items-center gap-4">
          <img
            src={club.head?.image || "/avatar-placeholder.png"}
            alt={club.head?.name}
            className="w-14 h-14 object-cover rounded-full shadow"
          />
          <div>
            <p className="text-gray-700 font-medium">{club.head?.name || "Not Assigned"}</p>
            <p className="text-gray-500 text-sm">{club.head?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      {club.members.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Members</h2>
          <ul className="mt-2 space-y-2">
            {club.members.map((member, index) => (
              <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm flex items-center gap-4">
                <img
                  src={member.user.image || "/avatar-placeholder.png"}
                  alt={member.user.name}
                  className="w-12 h-12 object-cover rounded-full shadow"
                />
                <div>
                  <span className="font-medium text-gray-800">{member.user.name}</span>{" "}
                  <span className="text-gray-500 text-sm">({member.status})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Upcoming Events</h2>
        <p className="mt-2 text-gray-600">{club.upcoming_events || "No upcoming events"}</p>
      </div>

      {/* Projects */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Projects</h2>
        <p className="mt-2 text-gray-600">{club.projects || "No projects available"}</p>
      </div>
    </div>
  );
};

export default ClubProfile;
