import React from "react";
const ContactInfo = ({ website, email, isDark }) => {
  // Function to determine icon and label based on URL
  const getSocialInfo = (url) => {
    if (!url) return null;
    
    if (url.includes('instagram.com')) {
      return {
        label: 'Instagram',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8a4 4 0 100 8 4 4 0 000-8zM16 8v.87m4 0v-.87a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8h-2z"
          />
        )
      };
    } else if (url.includes('facebook.com')) {
      return {
        label: 'Facebook',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
          />
        )
      };
    } else if (url.includes('linkedin.com')) {
      return {
        label: 'LinkedIn',
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          />
        )
      };
    }
    
    return {
      label: 'Website',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      )
    };
  };

  const socialInfo = website ? getSocialInfo(website) : null;

  return (
    <div className="flex flex-wrap gap-6 items-center mt-8">
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          title={website.replace(/(^\w+:|^)\/\//, '')}
          className={`inline-flex items-center px-4 py-2 
            ${isDark 
              ? 'bg-blue-600/20 hover:bg-blue-600/30' 
              : 'bg-blue-400/20 hover:bg-blue-400/30'
            } backdrop-blur-sm border border-blue-500/30 
            rounded-lg transition-all duration-300 group hover:scale-105`}
        >
          <div className={`p-2 rounded-full 
            ${isDark 
              ? 'bg-blue-500/20' 
              : 'bg-blue-300/20'
            } mr-3`}
          >
            <svg
              className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {socialInfo.icon}
            </svg>
          </div>
          <div>
            <span className="text-sm text-blue-200 opacity-80">{socialInfo.label}</span>
            <p className="text-blue-100 font-medium">
              {website.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
            </p>
          </div>
        </a>
      )}

{email && (
        <a
          href={`mailto:${email}`}
          title={email}
          className={`inline-flex items-center px-4 py-2 
            ${isDark 
              ? 'bg-blue-600/20 hover:bg-blue-600/30' 
              : 'bg-blue-400/20 hover:bg-blue-400/30'
            } backdrop-blur-sm border border-blue-500/30 
            rounded-lg transition-all duration-300 group hover:scale-105`}
        >
          <div className={`p-2 rounded-full 
            ${isDark 
              ? 'bg-blue-500/20' 
              : 'bg-blue-300/20'
            } mr-3`}
          >
            <svg
              className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm text-blue-200 opacity-80">Email</span>
            <p className="text-blue-100 font-medium">{email}</p>
          </div>
        </a>
      )}
    </div>
  );
};


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
 console.log(club);
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
        minLength: 3,
        validation: (value) => {
          if (!value.trim()) return "Club name is required";
          if (value.length < 3) return "Club name must be at least 3 characters";
          return null;
        }
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        value: editClub.description,
        rows: 4,
        required: true,
        minLength: 20,
        validation: (value) => {
          if (!value.trim()) return "Description is required";
          if (value.length < 20) return "Description must be at least 20 characters";
          return null;
        }
      },
      {
        id: "website",
        label: "Club Website",
        type: "url",
        value: editClub.website,
        validation: (value) => {
          if (value && !value.match(/^https?:\/\/.+\..+$/)) {
            return "Please enter a valid URL (starting with http:// or https://)";
          }
          return null;
        }
      },
      {
        id: "email",
        label: "Club Email",
        type: "email",
        value: editClub.email,
        validation: (value) => {
          if (value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return "Please enter a valid email address";
          }
          return null;
        }
      }
    ];

    return (
      <div className="space-y-6">
        {fields.map((field) => {
          const error = field.validation?.(field.value);
          
          return (
            <div key={field.id} className="relative">
              <label
                htmlFor={field.id}
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  rows={field.rows}
                  className={`w-full rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-400"
                  } ${error ? "border-red-500" : "border-gray-300"}
                    shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500`}
                  value={field.value}
                  onChange={(e) => {
                    setEditClub({ ...editClub, [field.id]: e.target.value });
                  }}
                  required={field.required}
                  minLength={field.minLength}
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  className={`w-full rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-400"
                  } ${error ? "border-red-500" : "border-gray-300"}
                    shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500`}
                  value={field.value}
                  onChange={(e) => {
                    setEditClub({ ...editClub, [field.id]: e.target.value });
                  }}
                  required={field.required}
                  minLength={field.minLength}
                />
              )}
              
              {error && (
                <p className="text-red-500 text-sm mt-1 absolute -bottom-6">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderFormButtons() {
    const hasErrors = () => {
      const fields = renderFormFields().props.children;
      return fields.some(field => field.props.children[2]); // Check if any field has error message
    };

    return (
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={hasErrors()}
          className={`px-6 py-3 rounded-lg shadow-lg transition duration-200 flex items-center
            ${hasErrors() 
              ? "bg-gray-500 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"}
            text-white font-medium`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Save Changes
        </button>
        
        <button
          type="button"
          onClick={() => {
            setEditMode(false);
            setEditClub(club); // Reset form
          }}
          className={`px-6 py-3 rounded-lg shadow-lg transition duration-200 flex items-center
            ${isDark 
              ? "bg-gray-700 hover:bg-gray-600" 
              : "bg-gray-200 hover:bg-gray-300"}
            text-gray-200 font-medium transform hover:scale-105`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
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
        
        {/* Add the new ContactInfo component */}
        {(club.website || club.email ) && (
          <ContactInfo 
            website={club.website}
            email={club.email}
            isDark={isDark}
          />
        )}
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
