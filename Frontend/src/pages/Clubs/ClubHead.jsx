import React from "react";

const ClubHead = ({ club, memberEditMode, editMemberData, setEditMemberData, handleUpdateMember, setMemberEditMode, startEditMember, handleRemoveMember, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden mb-8`}>
      <div className={`px-6 py-4 ${darkMode ? 'bg-gradient-to-r from-blue-800 to-indigo-900' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Club Head
        </h2>
      </div>

      {/* Club Head - Editable Mode */}
      <div key={club.head?.id} className="p-4 bg-gray-900 rounded-lg shadow">
        {memberEditMode === club.head?.id ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Name Input */}
              <div>
                <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  className={`w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  value={editMemberData.name}
                  onChange={(e) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  className={`w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  value={editMemberData.email}
                  onChange={(e) => setEditMemberData({ ...editMemberData, email: e.target.value })}
                />
              </div>

              {/* Role Selector (Fixed to Head) */}
              <div>
                <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Role</label>
                <select
                  className={`w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  value="head"
                  disabled
                >
                  <option value="head">Head</option>
                </select>
              </div>
            </div>

            {/* Save / Cancel Buttons */}
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition duration-200"
                onClick={() => handleUpdateMember(club.head?.id)}
              >
                Save Changes
              </button>
              <button
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-4 py-2 rounded-lg text-sm shadow-lg transition duration-200`}
                onClick={() => setMemberEditMode(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>{club.head?.name}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{club.head?.email}</p>
              </div>
            </div>

            {/* Edit / Remove Buttons */}
            <div className="flex gap-2">
              <button
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-3 py-1.5 rounded-lg text-sm shadow transition duration-200`}
                onClick={() => startEditMember({
                  user: {
                    id: club.head?.id,
                    name: club.head?.name,
                    email: club.head?.email
                  },
                  status: "head"
                })}
              >
                ✏️
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm shadow transition duration-200"
                onClick={() => handleRemoveMember(club.head?.id)}
              >
                ❌
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubHead;
