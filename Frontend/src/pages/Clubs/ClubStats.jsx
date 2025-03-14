import React from "react";

const ClubStats = ({ club, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden`}>
      <div className={`px-6 py-4 ${darkMode ? 'bg-gradient-to-r from-blue-800 to-indigo-900' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
        <h2 className="text-xl font-bold text-white flex items-center">
          📊 Club Stats
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center`}>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Members</p>
            <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{club.members?.length || 0}</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center`}>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Founded</p>
            <p className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>2023</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubStats;
