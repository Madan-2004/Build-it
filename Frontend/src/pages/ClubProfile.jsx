import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // If using React Router
// import { useRouter } from "next/router"; // If using Next.js

const API_BASE_URL = "http://localhost:8000/api"; // Change this to your backend API URL

const ClubProfile = () => {
    const { clubName } = useParams(); // React Router
    // const router = useRouter(); // Next.js
    // const { clubName } = router.query;

    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/clubs/${encodeURIComponent(clubName)}/`);
                if (!response.ok) {
                    throw new Error("Club not found");
                }
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!club) return <p>No club found.</p>;

//     return (
//         <div className="club-profile">
//             <h1>{club.name}</h1>
//             <p><strong>Head:</strong> {club.head ? club.head.name : "Not Assigned"}</p>
//             <p><strong>Description:</strong> {club.description || "No description available."}</p>
//             <p><strong>Projects:</strong> {club.projects || "No projects listed."}</p>
//             <p><strong>Upcoming Events:</strong> {club.upcoming_events || "No events scheduled."}</p>
//             <p><strong>Members:</strong> {club.members.length > 0 ? club.members.map(m => m.name).join(", ") : "No members yet."}</p>
//         </div>
//     );
// };

// export default ClubProfile;
return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800">{club.name}</h1>
      <p className="text-gray-600">{club.description}</p>
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Council</h2>
        <div className="flex items-center gap-4 mt-2">
          <img src={club.council.image} alt="Council Image" className="w-20 h-20 rounded-md" />
          <div>
            <h3 className="text-xl font-medium">{club.council.name}</h3>
            <p className="text-gray-600">{club.council.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Head</h2>
        <p className="text-gray-700 font-medium">{club.head.name}</p>
        <p className="text-gray-500 text-sm">{club.head.email}</p>
      </div>

      {club.members.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Members</h2>
          <ul className="mt-2 space-y-2">
            {club.members.map((member, index) => (
              <li key={index} className="text-gray-700 font-medium">
                {member.user.name} <span className="text-gray-500 text-sm">({member.status})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {club.upcoming_events ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Upcoming Events</h2>
          <p className="text-gray-600">{club.upcoming_events}</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-6">No upcoming events</p>
      )}

      {club.projects ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Projects</h2>
          <p className="text-gray-600">{club.projects}</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-6">No projects</p>
      )}
    </div>
  );
};

export default ClubProfile;
