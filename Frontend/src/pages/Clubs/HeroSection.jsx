import React from "react";

const HeroSection = ({
  club,
  editMode,
  setEditMode,
  editClub,
  setEditClub,
  handleUpdateClub,
  darkMode,
  setAddMemberDialogOpen,
}) => {
  // Default to dark theme to match the navbar in the image
  const isDark = darkMode !== undefined ? darkMode : true;

  return (
    <section
      className={`w-full ${
        isDark
          ? "bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900"
          : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900"
      } py-20 px-4 md:px-8 shadow-lg relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="relative flex-shrink-0 transform transition-all duration-500 hover:scale-105">
          <div
            className={`absolute inset-0 ${isDark ? "bg-blue-500" : "bg-blue-300"} rounded-full opacity-30 blur-xl transform -translate-x-2 translate-y-2`}
          ></div>
          <img
            src={
              club.image ||
              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
            }
            alt={club.name}
            className={`w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border-4 ${isDark ? "border-blue-600" : "border-blue-400"} shadow-2xl relative z-10`}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          {editMode ? (
            <form
              onSubmit={handleUpdateClub}
              className={`space-y-4 ${isDark ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90"} p-6 rounded-lg shadow-xl backdrop-filter backdrop-blur-sm`}
            >
              {renderFormFields()}
              {renderFormButtons()}
            </form>
          ) : (
            <div className="space-y-6">
              {renderClubInfo()}
              {renderActionButtons()}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-20"></div>
    </section>
  );

  function renderFormFields() {
    const fields = [
      {
        id: "name",
        label: "Club Name",
        type: "text",
        value: editClub.name,
        required: true,
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        value: editClub.description,
        rows: 3,
      },
      {
        id: "website",
        label: "Club Website",
        type: "url",
        value: editClub.website,
      },
      {
        id: "email",
        label: "Club Email",
        type: "email",
        value: editClub.email,
      },
    ];

    return fields.map((field) => (
      <div key={field.id}>
        <label
          htmlFor={field.id}
          className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {field.label}
        </label>
        {field.type === "textarea" ? (
          <textarea
            id={field.id}
            rows={field.rows}
            className={`mt-1 block w-full rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            value={field.value}
            onChange={(e) =>
              setEditClub({ ...editClub, [field.id]: e.target.value })
            }
            required={field.required}
          />
        ) : (
          <input
            id={field.id}
            type={field.type}
            className={`mt-1 block w-full rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            value={field.value}
            onChange={(e) =>
              setEditClub({ ...editClub, [field.id]: e.target.value })
            }
            required={field.required}
          />
        )}
      </div>
    ));
  }

  function renderFormButtons() {
    return (
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition duration-200"
        >
          Save
        </button>
        <button
          type="button"
          className={`px-5 py-2.5 ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} rounded-lg shadow transition duration-200`}
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
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          {club.name}
        </h1>
        <div className="flex items-center space-x-4 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 bg-opacity-30 text-blue-200 border border-blue-500">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {club.members?.length || 0} Members
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 bg-opacity-30 text-purple-200 border border-purple-500">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Est. 2023
          </span>
        </div>
        <p
          className={`text-xl leading-relaxed ${isDark ? "text-blue-100" : "text-blue-50"} mb-8 max-w-3xl`}
        >
          {club.description || "No description available."}
        </p>
        <div className="text-lg text-white space-y-2">
          {club.website && (
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-300"
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
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? "text-blue-300" : "text-blue-200"} hover:underline`}
              >
                {club.website}
              </a>
            </p>
          )}
          {club.email && (
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-300"
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
              <a
                href={`mailto:${club.email}`}
                className={`${isDark ? "text-blue-300" : "text-blue-200"} hover:underline`}
              >
                {club.email}
              </a>
            </p>
          )}
        </div>
      </>
    );
  }

  function renderActionButtons() {
    return (
      <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
        <button
          className={`px-6 py-3 ${isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg shadow-lg transition duration-200 flex items-center transform hover:scale-105 hover:shadow-xl`}
          onClick={() => setEditMode(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Club
        </button>
        <button
          className={`px-6 py-3 ${isDark ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"} text-white rounded-lg shadow-lg transition duration-200 flex items-center transform hover:scale-105 hover:shadow-xl`}
          onClick={() => setAddMemberDialogOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Add Member
        </button>
        <button
  onClick={() => {
    const projectsSection = document.getElementById("club-projects");
    if (projectsSection) {
      const offset = 80; // Adjust this value as needed
      const sectionTop = projectsSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop - offset, behavior: "smooth" });
    }
  }}
  className={`px-6 py-3 ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white rounded-lg shadow-lg transition duration-200 flex items-center transform hover:scale-105 hover:shadow-xl`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
      clipRule="evenodd"
    />
  </svg>
  View Projects
</button>

      </div>
    );
  }
};

export default HeroSection;
