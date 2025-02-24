import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api"; // Update API URL if needed

const ClubProfile = () => {
  const { clubName } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Member" });
  const [editMode, setEditMode] = useState(false);
  const [editClub, setEditClub] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clubs/${encodeURIComponent(clubName)}/`);
        if (!response.ok) throw new Error("Club not found");
        const data = await response.json();
        setClub(data);
        setEditClub({ name: data.name, description: data.description });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubName]);

  // Update club details
  const handleUpdateClub = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${club.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editClub),
      });

      if (!response.ok) throw new Error("Failed to update club");
      const updatedClub = await response.json();
      setClub(updatedClub);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating club:", err);
    }
  };

  // Add a new member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${club.id}/add-member/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) throw new Error("Failed to add member");
      const updatedClub = await response.json();
      setClub(updatedClub);
      setNewMember({ name: "", email: "", role: "Member" }); // Reset form
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  // Remove a member
  const handleRemoveMember = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${club.id}/remove-member/${userId}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) throw new Error("Failed to remove member");
      const updatedClub = await response.json();
      setClub(updatedClub);
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!club) return <p className="text-center text-gray-600">No club found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Club Header */}
      <div className="flex items-center gap-6">
        <img src={club.image || "/placeholder.svg"} alt={club.name} className="w-36 h-36 object-cover rounded-lg shadow-md" />
        <div>
          {editMode ? (
            <div>
              <input
                type="text"
                className="text-3xl font-bold text-gray-800 border p-2 rounded w-full"
                value={editClub.name}
                onChange={(e) => setEditClub({ ...editClub, name: e.target.value })}
              />
              <textarea
                className="text-gray-600 mt-2 border p-2 rounded w-full"
                value={editClub.description}
                onChange={(e) => setEditClub({ ...editClub, description: e.target.value })}
              />
              <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                onClick={handleUpdateClub}
              >
                Save
              </button>
              <button
                className="mt-2 ml-2 bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{club.name}</h1>
              <p className="text-gray-600 mt-2">{club.description || "No description available."}</p>
              <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setEditMode(true)}>
                Edit Club
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Club Head */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Club Head</h2>
        <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-sm flex items-center gap-4">
          <img src={club.head?.image || "/avatar-placeholder.png"} alt={club.head?.name} className="w-14 h-14 object-cover rounded-full shadow" />
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
              <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={member.user.image || "/avatar-placeholder.png"} alt={member.user.name} className="w-12 h-12 object-cover rounded-full shadow" />
                  <div>
                    <span className="font-medium text-gray-800">{member.user.name}</span>{" "}
                    <span className="text-gray-500 text-sm">({member.status})</span>
                  </div>
                </div>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleRemoveMember(member.user.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add New Member Form */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Add Member</h2>
        <form className="mt-2 p-4 bg-gray-100 rounded-lg shadow-sm space-y-4" onSubmit={handleAddMember}>
          <input type="text" className="w-full p-2 border rounded" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} required />
          <input type="email" className="w-full p-2 border rounded" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} required />
          <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded w-full">Add Member</button>
        </form>
      </div>
    </div>
  );
};

export default ClubProfile;
