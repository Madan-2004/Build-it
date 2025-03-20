import React, { useState } from 'react';

const AddMemberDialog = ({ addMemberDialogOpen, setAddMemberDialogOpen, handleAddMember, darkMode }) => {
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newMember.name.trim()) errors.name = 'Name is required';
    if (!newMember.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newMember.email)) errors.email = 'Email is invalid';
    if (!newMember.role) errors.role = 'Role is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      handleAddMember(newMember);
      setNewMember({ name: '', email: '', role: 'member' });
      setAddMemberDialogOpen(false);
    } else {
      setErrors(formErrors);
    }
  };

  const handleCloseDialogBackdrop = (e) => {
    if (e.target === e.currentTarget) {
      setAddMemberDialogOpen(false);
    }
  };

  if (!addMemberDialogOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleCloseDialogBackdrop}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className={`inline-block align-bottom ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                  darkMode ? "bg-blue-900" : "bg-blue-100"
                } sm:mx-0 sm:h-10 sm:w-10`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    darkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className={`text-lg leading-6 font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                  id="modal-title"
                >
                  Add New Member
                </h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="memberName"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="memberName"
                      id="memberName"
                      className={`mt-1 block w-full rounded-md ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      placeholder="Eg-Varshith"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="memberEmail"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="memberEmail"
                      id="memberEmail"
                      className={`mt-1 block w-full rounded-md ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      placeholder="Eg-cse220001044@iiti.ac.in"
                      value={newMember.email}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="memberRole"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Role
                    </label>
                    <select
                      id="memberRole"
                      name="memberRole"
                      className={`mt-1 block w-full rounded-md ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      value={newMember.role}
                      onChange={(e) =>
                        setNewMember({ ...newMember, role: e.target.value })
                      }
                    >
                      <option value="member">Member</option>
                      <option value="head">Head</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            } px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}
          >
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSubmit}
            >
              Add Member
            </button>
            <button
              type="button"
              className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={() => setAddMemberDialogOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDialog;
