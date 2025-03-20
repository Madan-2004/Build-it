import React, { useState } from "react";

const ClubMembers = ({
  club,
  memberEditMode,
  editMemberData,
  setEditMemberData,
  handleUpdateMember,
  setMemberEditMode,
  startEditMember,
  handleRemoveMember,
  darkMode,
  isAdmin,
  setAddMemberDialogOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Helper function to get role-specific colors
  const getRoleColor = (role, isDark) => {
    switch (role) {
      case "head":
        return isDark
          ? "bg-gradient-to-br from-blue-800 to-indigo-900"
          : "bg-gradient-to-br from-blue-400 to-indigo-500";
      default: // member
        return isDark
          ? "bg-gradient-to-br from-blue-700 to-blue-900"
          : "bg-gradient-to-br from-blue-400 to-blue-600";
    }
  };

  // Filter members based on search term and role filter
  const filteredMembers = club.members
    ? club.members
        .filter((member) => member.status !== "head")
        .filter(
          (member) =>
            member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .filter((member) => filterRole === "all" || member.role === filterRole)
    : [];

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl`}
    >
      <div
        className={`px-6 py-4 flex justify-between items-center ${darkMode ? "bg-gradient-to-r from-blue-800 to-indigo-900" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Members{" "}
          {club.members && club.members.length > 0
            ? `(${club.members.length})`
            : ""}
        </h2>
        {isAdmin && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition duration-200 flex items-center transform hover:scale-105"
            onClick={() => setAddMemberDialogOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Member
          </button>
        )}
      </div>

      {club.members && club.members.length > 0 ? (
        <>
         

          {/* Members Grid */}
          <div className="p-4">
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.user.id}
                    className={`p-5 ${darkMode ? "bg-gray-750 hover:bg-gray-700" : "bg-gray-50 hover:bg-white"} rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} transition duration-300 hover:shadow-md transform hover:translate-y-[-2px]`}
                  >
                    {memberEditMode === member.user.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label
                              className={`block text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-700"} mb-1`}
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              className={`w-full p-2.5 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                              value={editMemberData.name}
                              onChange={(e) =>
                                setEditMemberData({
                                  ...editMemberData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-700"} mb-1`}
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              className={`w-full p-2.5 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                              value={editMemberData.email}
                              onChange={(e) =>
                                setEditMemberData({
                                  ...editMemberData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-700"} mb-1`}
                            >
                              Role
                            </label>
                            <select
                              className={`w-full p-2.5 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                              value={editMemberData.role}
                              onChange={(e) =>
                                setEditMemberData({
                                  ...editMemberData,
                                  role: e.target.value,
                                })
                              }
                            >
                              <option value="member">Member</option>
                              <option value="head">Head</option>
                              <option value="coordinator">Coordinator</option>
                              <option value="secretary">Secretary</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition duration-200 flex items-center"
                            onClick={() => handleUpdateMember(member.user.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save Changes
                          </button>
                          <button
                            className={`${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} px-4 py-2 rounded-lg text-sm shadow-lg transition duration-200 flex items-center`}
                            onClick={() => setMemberEditMode(null)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center ${getRoleColor(member.role, darkMode)}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"} text-lg`}>
                              {member.user.name}
                            </p>
                            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm flex items-center`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 opacity-70"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {member.user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                member.role === "coordinator"
                                  ? darkMode
                                    ? "bg-purple-900 text-purple-200"
                                    : "bg-purple-100 text-purple-800"
                                  : member.role === "secretary"
                                    ? darkMode
                                      ? "bg-green-900 text-green-200"
                                      : "bg-green-100 text-green-800"
                                    : darkMode
                                      ? "bg-blue-900 text-blue-200"
                                      : "bg-blue-100 text-blue-800"
                              } shadow-sm`}
                            >
                              {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : "Member"}
                            </span>

                            {member.joinDate && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                              }`}>
                                Joined {new Date(member.joinDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {isAdmin && (
                            <div className="flex gap-2">
                              <button
                                className={`${
                                  darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                } p-2 rounded-lg text-sm shadow transition duration-200 hover:scale-105`}
                                onClick={() => startEditMember(member)}
                                title="Edit Member"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-sm shadow transition duration-200 hover:scale-105"
                                onClick={() =>
                                  handleRemoveMember(member.user.id)
                                }
                                title="Remove Member"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No members match your search criteria.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className={`p-8 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="text-xl font-medium mb-2">
            No members have been added yet.
          </p>
          {isAdmin && (
            <p className="text-md">
              Click the "Add" button to add members to this club.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClubMembers;
