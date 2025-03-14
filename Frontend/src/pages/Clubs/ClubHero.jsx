import React from 'react';

const ClubHero = ({ club, darkMode, editMode, editClub, setEditClub, handleUpdateClub, setEditMode, setAddMemberDialogOpen }) => {
  return (
    <div className={`w-full ${darkMode ? 'bg-gradient-to-r from-blue-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500'} py-16 px-4 md:px-8 shadow-2xl`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="relative flex-shrink-0">
          <div className={`absolute inset-0 ${darkMode ? 'bg-blue-600' : 'bg-blue-400'} rounded-full opacity-20 blur-lg transform -translate-x-2 translate-y-2`}></div>
          <img
            src={club.image || "/placeholder.svg"}
            alt={club.name}
            className={`w-40 h-40 object-cover rounded-full border-4 ${darkMode ? 'border-blue-500' : 'border-blue-600'} shadow-lg relative z-10`}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          {editMode ? (
            <form onSubmit={handleUpdateClub} className={`space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              {/* Form fields */}
              {/* ... (copy the form fields from the original code) ... */}
            </form>
          ) : (
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{club.name}</h1>
              <p className={`text-lg ${darkMode ? 'text-blue-300' : 'text-blue-600'} mb-6`}>{club.description || "No description available."}</p>
              <div className="text-lg">
                <p><strong>Club Website:</strong> <a href={club.website || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{club.website || "Not Available"}</a></p>
                <p><strong>Club Email:</strong> <a href={`mailto:${club.email}`} className="text-blue-500 hover:underline">{club.email || "Not Available"}</a></p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition duration-200 flex items-center"
                  onClick={() => setEditMode(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Club
                </button>
                <button
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-200 flex items-center"
                  onClick={() => setAddMemberDialogOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Add Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubHero;
