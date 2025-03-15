import React from "react";

const HeroSection = ({ club, editMode, setEditMode, editClub, setEditClub, handleUpdateClub, darkMode, setAddMemberDialogOpen }) => {
  return (
    <section className={`w-full ${darkMode ? 'bg-gradient-to-r from-blue-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500'} py-16 px-4 md:px-8 shadow-2xl`}>
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
              {renderFormFields()}
              {renderFormButtons()}
            </form>
          ) : (
            <div>
              {renderClubInfo()}
              {renderActionButtons()}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  function renderFormFields() {
    const fields = [
      { id: "clubName", label: "Club Name", type: "text", value: editClub.name, required: true },
      { id: "description", label: "Description", type: "textarea", value: editClub.description, rows: 3 },
      { id: "website", label: "Club Website", type: "url", value: editClub.website },
      { id: "email", label: "Club Email", type: "email", value: editClub.email }
    ];

    return fields.map(field => (
      <div key={field.id}>
        <label htmlFor={field.id} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {field.label}
        </label>
        {field.type === "textarea" ? (
          <textarea
            id={field.id}
            rows={field.rows}
            className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            value={field.value}
            onChange={(e) => setEditClub({ ...editClub, [field.id]: e.target.value })}
            required={field.required}
          />
        ) : (
          <input
            id={field.id}
            type={field.type}
            className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            value={field.value}
            onChange={(e) => setEditClub({ ...editClub, [field.id]: e.target.value })}
            required={field.required}
          />
        )}
      </div>
    ));
  }

  function renderFormButtons() {
    return (
      <div className="flex gap-2">
        <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition duration-200">
          Save
        </button>
        <button
          type="button"
          className={`px-5 py-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-lg shadow-lg transition duration-200`}
          onClick={() => setEditMode(false)}
        >
          Cancel
        </button>
      </div>
    );
  }

  function renderClubInfo() {
    return (
      <>
        <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{club.name}</h1>
        <p className={`text-lg ${darkMode ? 'text-blue-300' : 'text-blue-600'} mb-6`}>{club.description || "No description available."}</p>
        <div className="text-lg">
          <p><strong>Club Website:</strong> <a href={club.website || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{club.website || "Not Available"}</a></p>
          <p><strong>Club Email:</strong> <a href={`mailto:${club.email}`} className="text-blue-500 hover:underline">{club.email || "Not Available"}</a></p>
        </div>
      </>
    );
  }

  function renderActionButtons() {
    return (
      <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition duration-200 flex items-center" onClick={() => setEditMode(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Club
        </button>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-200 flex items-center" onClick={() => setAddMemberDialogOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Add Member
        </button>
      </div>
    );
  }
};

export default HeroSection;
