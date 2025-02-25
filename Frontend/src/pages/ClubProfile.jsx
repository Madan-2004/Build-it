import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000"; // Update API URL if needed

const ClubProfile = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "member" });
  const [editMode, setEditMode] = useState(false);
  const [editClub, setEditClub] = useState({ name: "", description: "" });
  const [memberEditMode, setMemberEditMode] = useState(null);
  const [editMemberData, setEditMemberData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetchClubDetails();
  }, [clubName]);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/`);
      
      if (!response.ok) {
        throw new Error(`Club not found (Status: ${response.status})`);
      }
      
      const data = await response.json();
      setClub(data);
      setEditClub({ name: data.name, description: data.description || "" });
    } catch (err) {
      console.error("Error fetching club details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update club details
  const handleUpdateClub = async (e) => {
    e.preventDefault();
    
    if (!editClub.name.trim()) {
      alert("Club name cannot be empty");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/councils/${club.council}/clubs/${club.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editClub.name,
          description: editClub.description,
          head: club.head?.id || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update club");
      }
      
      const updatedClub = await response.json();
      setClub(updatedClub);
      setEditMode(false);
      
      // If club name changed, redirect to new URL
      if (updatedClub.name !== clubName) {
        navigate(`/clubs/${encodeURIComponent(updatedClub.name)}`);
      }
    } catch (err) {
      console.error("Error updating club:", err);
      alert(`Error updating club: ${err.message}`);
    }
  };

  // Add a new member
  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!newMember.name.trim() || !newMember.email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${club.id}/add-member/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add member");
      }
      
      const updatedClub = await response.json();
      setClub(updatedClub);
      setNewMember({ name: "", email: "", role: "member" }); // Reset form
    } catch (err) {
      console.error("Error adding member:", err);
      alert(`Error adding member: ${err.message}`);
    }
  };

  // Start editing a member
  const startEditMember = (member) => {
    setMemberEditMode(member.user.id);
    setEditMemberData({
      name: member.user.name,
      email: member.user.email,
      role: member.status
    });
  };

  // Update member details
  const handleUpdateMember = async (userId) => {
    if (!editMemberData.name.trim() || !editMemberData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${club.id}/edit-member/${userId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMemberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }
      
      const updatedClub = await response.json();
      setClub(updatedClub);
      setMemberEditMode(null);
    } catch (err) {
      console.error("Error updating member:", err);
      alert(`Error updating member: ${err.message}`);
    }
  };

  // Remove a member
  const handleRemoveMember = async (userId) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${club.id}/remove-member/${userId}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove member");
      }
      
      const updatedClub = await response.json();
      setClub(updatedClub);
    } catch (err) {
      console.error("Error removing member:", err);
      alert(`Error removing member: ${err.message}`);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="max-w-4xl mx-auto p-6 bg-red-50 text-red-800 rounded-lg shadow-lg">Error: {error}</div>;
  if (!club) return <div className="max-w-4xl mx-auto p-6 bg-gray-50 text-gray-800 rounded-lg shadow-lg">No club found with this name.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10">
      {/* Club Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <img 
          src={club.image || "/placeholder.svg"} 
          alt={club.name} 
          className="w-32 h-32 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          {editMode ? (
            <form onSubmit={handleUpdateClub} className="space-y-4">
              <div>
                <label htmlFor="clubName" className="block text-sm font-medium text-gray-700">Club Name</label>
                <input
                  id="clubName"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editClub.name}
                  onChange={(e) => setEditClub({ ...editClub, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editClub.description}
                  onChange={(e) => setEditClub({ ...editClub, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{club.name}</h1>
              <p className="text-gray-600 mt-2">{club.description || "No description available."}</p>
              <button 
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setEditMode(true)}
              >
                Edit Club
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Club Head */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Club Head</h2>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg shadow-sm flex items-center gap-4">
          <img 
            src={club.head?.image || "/avatar-placeholder.png"} 
            alt={club.head?.name || "Club Head"} 
            className="w-14 h-14 object-cover rounded-full shadow"
          />
          <div>
            <p className="text-gray-800 font-medium">{club.head?.name || "Not Assigned"}</p>
            <p className="text-gray-500 text-sm">{club.head?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Members {club.members && club.members.length > 0 ? `(${club.members.length})` : ""}
        </h2>
        {club.members && club.members.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {club.members.map((member) => (
              <li key={member.user.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                {memberEditMode === member.user.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <img 
                        src={member.user.image || "/avatar-placeholder.png"} 
                        alt={member.user.name} 
                        className="w-12 h-12 object-cover rounded-full shadow" 
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Name</label>
                          <input
                            type="text"
                            className="w-full p-1.5 border rounded text-sm"
                            value={editMemberData.name}
                            onChange={(e) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Email</label>
                          <input
                            type="email"
                            className="w-full p-1.5 border rounded text-sm"
                            value={editMemberData.email}
                            onChange={(e) => setEditMemberData({ ...editMemberData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Role</label>
                          <select
                            className="w-full p-1.5 border rounded text-sm"
                            value={editMemberData.role}
                            onChange={(e) => setEditMemberData({ ...editMemberData, role: e.target.value })}
                          >
                            <option value="member">Member</option>
                            <option value="head">Head</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        onClick={() => handleUpdateMember(member.user.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400"
                        onClick={() => setMemberEditMode(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={member.user.image || "/avatar-placeholder.png"} 
                        alt={member.user.name} 
                        className="w-12 h-12 object-cover rounded-full shadow" 
                      />
                      <div>
                        <p className="font-medium text-gray-800">{member.user.name}</p>
                        <p className="text-gray-500 text-sm">{member.user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          {member.status === "head" ? "Head" : "Member"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        onClick={() => startEditMember(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        onClick={() => handleRemoveMember(member.user.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
            No members have been added to this club yet.
          </div>
        )}
      </div>

      {/* Add New Member Form */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Add Member</h2>
        <form className="mt-3 p-4 bg-gray-50 rounded-lg shadow-sm" onSubmit={handleAddMember}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="memberName" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="memberName"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Full Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="memberEmail"
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="email@example.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="memberRole"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="head">Head</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClubProfile;