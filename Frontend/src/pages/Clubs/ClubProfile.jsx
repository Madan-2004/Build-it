import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClubProjects from "./ClubProjects";
import ClubHero from "./ClubHero";
import HeroSection from "./HeroSection";
import ClubHead from "./ClubHead";
import ClubStats from "./ClubStats";
import ClubMembers from "./ClubMembers";




const API_BASE_URL = "http://localhost:8000"; // Update API URL if needed

const ClubProfile = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "member" });
  const [editMode, setEditMode] = useState(false);
  const [editClub, setEditClub] = useState({ name: "", description: "", website: "", email: "" });
  const [memberEditMode, setMemberEditMode] = useState(null);
  const [editMemberData, setEditMemberData] = useState({ name: "", email: "", role: "" });
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchClubDetails();
  }, [clubName]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  const isValidIITIEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@iiti\.ac\.in$/.test(email);
  };
  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/`);

      if (!response.ok) {
        throw new Error(`Club not found (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log(data);
      setClub(data);

      setEditClub({ name: data.name, description: data.description || "", website: data.website || "", email: data.email || "" });
    } catch (err) {
      console.error("Error fetching club details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();

    if (!editClub.name.trim()) {
      alert("Club name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/update/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editClub.name,
          description: editClub.description,
          website: editClub.website,
          email: editClub.email,
          head_id: club.head?.id || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update club");
      }

      const updatedClub = await response.json();
      setClub(updatedClub);
      setEditMode(false);

      if (updatedClub.name !== clubName) {
        navigate(`/clubs/${encodeURIComponent(updatedClub.name)}`);
      }
    } catch (err) {
      console.error("Error updating club:", err);
      alert(`Error updating club: ${err.message}`);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!newMember.name.trim() || !newMember.email.trim()) {
      alert("Name and email are required");
      return;
    }
    if (!isValidIITIEmail(newMember.email)) {
      alert("Invalid email! Only @iiti.ac.in emails are allowed.");
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
      setAddMemberDialogOpen(false); // Close the dialog after adding member
    } catch (err) {
      console.error("Error adding member:", err);
      alert(`Error adding member: ${err.message}`);
    }
  };

  const startEditMember = (member) => {
    console.log(member);
    setMemberEditMode(member.user.id);
    setEditMemberData({
      name: member.user.name,
      email: member.user.email,
      role: member.status
    });
  };

  const handleUpdateMember = async (userId) => {
    if (!editMemberData.name.trim() || !editMemberData.email.trim()) {
      alert("Name and email are required");
      return;
    }
    if (!isValidIITIEmail(editMemberData.email)) {
      alert("Invalid email! Only @iiti.ac.in emails are allowed.");
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

  // Function to close the Add Member dialog
  const handleCloseDialogBackdrop = () => {
    setAddMemberDialogOpen(false);
  };

  const handleDeleteClub = async () => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/delete/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete club");
      }

      alert("Club deleted successfully");
      navigate("/clubs");
    } catch (err) {
      console.error("Error deleting club:", err);
      alert(`Error deleting club: ${err.message}`);
    }
  };
  //for future purpose features
  const renameClub = async (newName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/rename/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: newName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rename club");
      }

      const data = await response.json();
      alert("Club renamed successfully!");
      navigate(`/clubs/${encodeURIComponent(data.new_name)}`); // Redirect to new club URL
    } catch (err) {
      console.error("Error renaming club:", err);
      alert(`Error renaming club: ${err.message}`);
    }
  };




  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
    </div>
  );

  if (error) return (
    <div className={`max-w-4xl mx-auto p-6 my-10 ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-900'} rounded-lg shadow-xl`}>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-xl font-semibold">Error: {error}</span>
      </div>
    </div>
  );

  if (!club) return (
    <div className={`max-w-4xl mx-auto p-6 my-10 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'} rounded-lg shadow-xl`}>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xl font-semibold">No club found with this name.</span>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} pb-10`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-800'} shadow-lg transition-all duration-300`}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <HeroSection
        club={club}
        editMode={editMode}
        setEditMode={setEditMode}
        editClub={editClub}
        setEditClub={setEditClub}
        handleUpdateClub={handleUpdateClub}
        darkMode={darkMode}
        setAddMemberDialogOpen={setAddMemberDialogOpen}
      />


      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Left Column */}
  <div className="lg:col-span-1">
    <div>
      <ClubHead
        club={club}
        darkMode={darkMode}
        memberEditMode={memberEditMode}
        editMemberData={editMemberData}
        setEditMemberData={setEditMemberData}
        handleUpdateMember={handleUpdateMember}
        setMemberEditMode={setMemberEditMode}
        startEditMember={startEditMember}
        handleRemoveMember={handleRemoveMember}
        isAdmin={isAdmin} 
      />
    </div>

    <ClubStats club={club} darkMode={darkMode} />
  </div>

  {/* Right Column - Members List */}
  <div className="lg:col-span-2">
  <ClubMembers 
  club={club} 
  memberEditMode={memberEditMode} 
  editMemberData={editMemberData} 
  setEditMemberData={setEditMemberData} 
  handleUpdateMember={handleUpdateMember} 
  setMemberEditMode={setMemberEditMode} 
  startEditMember={startEditMember} 
  handleRemoveMember={handleRemoveMember} 
  darkMode={darkMode} 
  isAdmin={isAdmin} 
  setAddMemberDialogOpen={setAddMemberDialogOpen} 
/>

  </div>
</div>
        <div className="mt-8">
          <ClubProjects clubId={club.id} />
        </div>
      </div>


      {/* Add Member Dialog */}
      {addMemberDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={handleCloseDialogBackdrop}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className={`inline-block align-bottom ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`} id="modal-title">
                      Add New Member
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="memberName" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                        <input
                          type="text"
                          name="memberName"
                          id="memberName"
                          className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          placeholder="Eg-Varshith"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="memberEmail" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                        <input
                          type="email"
                          name="memberEmail"
                          id="memberEmail"
                          className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          placeholder="Eg-cse220001044@iiti.ac.in"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="memberRole" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                        <select
                          id="memberRole"
                          name="memberRole"
                          className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          value={newMember.role}
                          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        >
                          <option value="member">Member</option>
                          <option value="head">Head</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddMember}
                >
                  Add Member
                </button>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => setAddMemberDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubProfile;