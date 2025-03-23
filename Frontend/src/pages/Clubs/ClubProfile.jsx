import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClubProjects from "./ClubProjects";
import ClubHero from "./ClubHero";
import HeroSection from "./HeroSection";
import ClubHead from "./ClubHead";
import ClubStats from "./ClubStats";
import ClubMembers from "./ClubMembers";
import authService from "../../services/auth";
import { isAdmin as checkIsAdmin } from "../../utils/adminCheck";
import ClubEvents from "./ClubEvents";

const API_BASE_URL = "http://localhost:8000"; // Update API URL if needed

const ClubProfile = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member",
  });
  const [editMode, setEditMode] = useState(false);
  const [editClub, setEditClub] = useState({
    name: "",
    description: "",
    website: "",
    email: "",
  });
  const [memberEditMode, setMemberEditMode] = useState(null);
  const [editMemberData, setEditMemberData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [user, setUser] = useState(null); // Store logged-in user details
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Get logged-in user from cookie
    const userData = authService.getUserFromCookie();
    setUser(userData);
    console.log("Logged-in user:", userData);

    // if (userData) {
    //   fetchClubDetails(userData); // Pass userData to avoid redundant state updates
    // }
  }, [clubName]);

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
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/`,
      );

      if (!response.ok) {
        throw new Error(`Club not found (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log(data);
      setClub(data);

      setEditClub({
        name: data.name,
        description: data.description || "",
        website: data.website || "",
        email: data.email || "",
      });
      // Check if user is club head (admin)
    // Enhanced admin check
    
    } catch (err) {
      console.error("Error fetching club details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && club) {
      // Check if user is admin
      const isHeadOfClub = club.head && user.email === club.head.email;
      const isAdminUser = checkIsAdmin(user.email);
      console.log("Admin check:", { isHeadOfClub, isAdminUser, userEmail: user.email });
      setIsAdmin(isHeadOfClub || isAdminUser);
    } else {
      console.log("User not logged in or club not loaded");
      setIsAdmin(false);
    }
  }, [user, club]);

  const handleUpdateClub = async (e) => {
    e.preventDefault();

    if (!editClub.name.trim()) {
      alert("Club name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/update/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editClub.name,
            description: editClub.description,
            website: editClub.website,
            email: editClub.email,
            head_id: club.head?.id || null,
          }),
        },
      );

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
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${club.id}/add-member/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember),
        },
      );

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
      role: member.status,
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
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${club.id}/edit-member/${userId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editMemberData),
        },
      );

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
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${club.id}/remove-member/${userId}/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
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
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/delete/`,
        {
          method: "DELETE",
        },
      );

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
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/rename/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_name: newName }),
        },
      );

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

  if (loading)
    return (
      <div
        className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <div
          className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${darkMode ? "border-blue-500" : "border-blue-600"}`}
        ></div>
      </div>
    );

  if (error)
    return (
      <div
        className={`max-w-4xl mx-auto p-6 my-10 ${darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-900"} rounded-lg shadow-xl`}
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mr-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-xl font-semibold">Error: {error}</span>
        </div>
      </div>
    );

  if (!club)
    return (
      <div
        className={`max-w-4xl mx-auto p-6 my-10 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"} rounded-lg shadow-xl`}
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mr-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xl font-semibold">
            No club found with this name.
          </span>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"} pb-10`}
    >
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200"} shadow-lg transition-all duration-300 transform hover:scale-105`}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
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
        {/* Navigation Tabs */}
        <div className={`mb-8 border-b ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
  <div className="flex space-x-8">
    <button
      onClick={() => setActiveTab("overview")}
      className={`py-4 px-1 border-b-2 font-medium text-lg ${
        activeTab === "overview"
          ? darkMode
            ? "border-blue-500 text-blue-400"
            : "border-blue-600 text-blue-600"
          : darkMode
          ? "text-gray-400 hover:text-gray-300 border-transparent"
          : "text-gray-500 hover:text-gray-700 border-transparent"
      } -mb-px`}
    >
      Overview
    </button>
    <button
      onClick={() => setActiveTab("events")}
      className={`py-4 px-1 border-b-2 font-medium text-lg ${
        activeTab === "events"
          ? darkMode
            ? "border-blue-500 text-blue-400"
            : "border-blue-600 text-blue-600"
          : darkMode
          ? "text-gray-400 hover:text-gray-300 border-transparent"
          : "text-gray-500 hover:text-gray-700 border-transparent"
      } -mb-px`}
    >
      Events
    </button>
  </div>
</div>
        {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-20">
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

              <ClubStats club={club} darkMode={darkMode} />

              {/* Quick Links Card */}
              <div
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-xl overflow-hidden mt-8`}
              >
                <div
                  className={`px-6 py-4 ${darkMode ? "bg-gradient-to-r from-purple-800 to-indigo-900" : "bg-gradient-to-r from-purple-500 to-indigo-500"}`}
                >
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Quick Links
                  </h2>
                </div>
                <div className="p-4 space-y-2">
                  {club.website && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-3 rounded-lg ${darkMode ? "bg-gray-750 text-blue-400 hover:bg-gray-700" : "bg-gray-50 text-blue-600 hover:bg-gray-100"} transition duration-150`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        Club Website
                      </div>
                    </a>
                  )}
                  <a
                    href="#"
                    className={`block p-3 rounded-lg ${darkMode ? "bg-gray-750 text-blue-400 hover:bg-gray-700" : "bg-gray-50 text-blue-600 hover:bg-gray-100"} transition duration-150`}
                  >
                    <div className="flex items-center">
  <button
    onClick={() => setActiveTab("events")}
    className={`block  rounded-lg ${darkMode ? "bg-gray-750 text-blue-400 hover:bg-gray-700" : "bg-gray-50 text-blue-600 hover:bg-gray-100"} transition duration-150 flex items-center`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    Upcoming Events
  </button>
</div>
                  </a>
                  <a
                    href="#"
                    className={`block p-3 rounded-lg ${darkMode ? "bg-gray-750 text-blue-400 hover:bg-gray-700" : "bg-gray-50 text-blue-600 hover:bg-gray-100"} transition duration-150`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Club Constitution
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Members List */}
          <div className="lg:col-span-2 space-y-8">
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

            <div id="club-projects" className="mt-8">
              <ClubProjects clubId={club.id} darkMode={darkMode} />
            </div>

          </div>
        </div>
         ) : (
          <ClubEvents clubId={club.id} darkMode={darkMode} />
        )}
      </div>
      

      {/* Add Member Dialog */}
      {addMemberDialogOpen && (
  <div
    className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl transform transition-all max-w-md w-full border border-gray-700"
        tabIndex="-1"
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2
              className="text-xl font-bold text-white"
              id="modal-title"
            >
              Add New Member
            </h2>
          </div>
        </div>

        {/* Form content */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <label
              htmlFor="memberName"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="memberName"
                id="memberName"
                className="block w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter full name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                required
                autoFocus
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="memberEmail"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="memberEmail"
                id="memberEmail"
                className="block w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter email address"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    email: e.target.value,
                  })
                }
                required
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="memberRole"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Role
            </label>
            <div className="relative">
              <select
                id="memberRole"
                name="memberRole"
                className="block w-full rounded-lg bg-gray-800 border-gray-700 text-white appearance-none px-4 py-2.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
                aria-required="true"
              >
                <option value="member">Member</option>
                <option value="head">Head</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-4 bg-gray-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
            onClick={() => setAddMemberDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddMember}
            disabled={!newMember.name || !newMember.email}
          >
            Add Member
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
