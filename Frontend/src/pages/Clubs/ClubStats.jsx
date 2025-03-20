import React from "react";

const ClubStats = ({ club, darkMode }) => {
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:translate-y-[-2px]`}
    >
      <div
        className={`px-6 py-4 ${darkMode ? "bg-gradient-to-r from-blue-800 to-indigo-900" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Club Stats
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div
            className={`${darkMode ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-100 hover:bg-gray-50"} p-5 rounded-lg text-center transition-colors duration-300 transform hover:scale-105`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center ${darkMode ? "bg-blue-900" : "bg-blue-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${darkMode ? "text-blue-300" : "text-blue-600"}`}
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
              </div>
              <p
                className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm font-medium mb-1`}
              >
                Members
              </p>
              <p
                className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                {club.members?.length || 0}
              </p>
            </div>
          </div>
          <div
            className={`${darkMode ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-100 hover:bg-gray-50"} p-5 rounded-lg text-center transition-colors duration-300 transform hover:scale-105`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center ${darkMode ? "bg-purple-900" : "bg-purple-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${darkMode ? "text-purple-300" : "text-purple-600"}`}
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
              </div>
              <p
                className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm font-medium mb-1`}
              >
                Founded
              </p>
              <p
                className={`text-2xl font-bold ${darkMode ? "text-purple-400" : "text-purple-600"}`}
              >
                2023
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ClubStats;
