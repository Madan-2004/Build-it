import React from "react";

const ClubHead = ({
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
}) => {
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl transform hover:translate-y-[-2px]`}
    >
      <div
        className={`px-6 py-4 ${darkMode ? "bg-gradient-to-r from-blue-800 to-indigo-900" : "bg-gradient-to-r from-blue-500 to-indigo-500"} flex justify-between items-center`}
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Club Head
        </h2>
      </div>

      <div className="p-4">
        {club.head ? (
          <div
            key={club.head?.id}
            className={`p-5 ${darkMode ? "bg-gray-750 hover:bg-gray-700" : "bg-gray-50 hover:bg-white"} rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} transition duration-300 hover:shadow-md`}
          >
            {memberEditMode === club.head?.id ? (
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
                      value="head"
                      disabled
                    >
                      <option value="head">Head</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition duration-200 flex items-center"
                    onClick={() => handleUpdateMember(club.head?.id)}
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-blue-800 to-indigo-900" : "bg-gradient-to-br from-blue-400 to-indigo-500"} shadow-md`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-9 text-white"
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
                      <p
                        className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"} text-xl`}
                      >
                        {club.head?.name}
                      </p>
                      <p
                        className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm flex items-center`}
                      >
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
                        {club.head?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode
                        ? "bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200"
                        : "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800"
                    } shadow-sm`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Club Head
                  </span>

                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        className={`${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} p-2 rounded-lg text-sm shadow transition duration-200 hover:scale-105`}
                        onClick={() =>
                          startEditMember({
                            user: {
                              id: club.head?.id,
                              name: club.head?.name,
                              email: club.head?.email,
                            },
                            status: "head",
                          })
                        }
                        title="Edit Club Head"
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
                        onClick={() => handleRemoveMember(club.head?.id)}
                        title="Remove Club Head"
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
        ) : (
          <div
            className={`p-6 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">No Club Head Assigned</p>
            {isAdmin && (
              <button
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm shadow transition duration-200"
                onClick={() => setAddMemberDialogOpen(true)}
              >
                Add Club Head
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubHead;
