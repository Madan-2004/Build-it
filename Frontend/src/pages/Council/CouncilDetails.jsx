"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/councildetails.css";

const BASE_URL = "http://127.0.0.1:8000";

const ClubForm = ({ onSubmit, onClose, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        head: initialData?.head || "",
        description: initialData?.description || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        onSubmit(formData);
    };

    return (
        <div className="modal">
            <div className="modal-content bg-gray-800 text-white rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">
                    {initialData ? "Edit Club" : "Add New Club"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {["name", "head", "description"].map((field) => (
                        <div key={field} className="form-group mb-4">
                            <label className="block text-blue-300 mb-2 uppercase text-sm tracking-wider">
                                {field.replace("_", " ")}
                            </label>
                            {field === "description" ? (
                                <textarea
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                    <div className="modal-actions flex justify-end mt-6 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            {initialData ? "Update Club" : "Create Club"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmation = ({ clubName, onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <div className="modal-content bg-gray-800 text-white rounded-xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Delete Club</h2>
                <p className="mb-6">Are you sure you want to delete <span className="font-bold">{clubName}</span>? This action cannot be undone.</p>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const CouncilDetails = () => {
    const { councilName } = useParams();
    const [councilDetails, setCouncilDetails] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [deletingClub, setDeletingClub] = useState(null);

    const fetchCouncilData = () => {
        setLoading(true);
        // Fetch council details
        axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/`)
            .then((response) => {
                setCouncilDetails(response.data);
                return axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`);
            })
            .then((response) => {
                setClubs(response.data.clubs);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to load council data");
                setLoading(false);
                console.error(error);
            });
    };

    useEffect(() => {
        fetchCouncilData();
    }, [councilName]);

    // Create new club
    const handleAddClub = async (formData) => {
        try {
            await axios.post(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`, formData);
            fetchCouncilData();
            setShowForm(false);
        } catch (error) {
            setError("Failed to save club");
            console.error(error);
        }
    };

    // Update existing club
    const handleUpdateClub = async (formData) => {
        try {
            await axios.put(`${BASE_URL}/api/clubs/${editingClub.id}/`, formData);
            fetchCouncilData();
            setEditingClub(null);
        } catch (error) {
            setError("Failed to update club");
            console.error(error);
        }
    };

    // Delete club
    const handleDeleteClub = async () => {
        try {
            await axios.delete(`${BASE_URL}/api/clubs/${deletingClub.id}/`);
            fetchCouncilData();
            setDeletingClub(null);
        } catch (error) {
            setError("Failed to delete club");
            console.error(error);
        }
    }; // Function to get a random gradient background for each club
    const getRandomGradient = (index) => {
        const gradients = [
            "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
            "bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500",
            "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
            "bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500",
            "bg-gradient-to-r from-gray-700 via-gray-800 to-black"
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Full width hero section for council details */}
            <div className="council-hero w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-blue-400">Loading council data...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900 border-l-4 border-red-500 text-white p-6 rounded">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            {/* Council Info */}
                            <div className="text-center md:text-left">
                                <h1 className="text-5xl font-bold text-white mb-3">{councilName}</h1>
                                <div className="h-1 w-32 bg-blue-500 mx-auto md:mx-0 mb-6"></div>
                                <p className="text-blue-300 text-xl mb-6">Student Clubs & Organizations</p>

                                {councilDetails && councilDetails.description && (
                                    <div className="max-w-3xl text-gray-300 mb-8 text-lg">
                                        <p>{councilDetails.description}</p>
                                    </div>
                                )}

                                {/* Council Stats */}
                                <div className="inline-flex gap-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                                    <div className="stat-item text-center">
                                        <span className="text-3xl font-bold text-blue-400">{clubs.length}</span>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Total Clubs</p>
                                    </div>

                                    {councilDetails && councilDetails.established && (
                                        <div className="stat-item text-center">
                                            <span className="text-3xl font-bold text-blue-400">{councilDetails.established}</span>
                                            <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Est. Year</p>
                                        </div>
                                    )}

                                    {councilDetails && councilDetails.faculty_advisor && (
                                        <div className="stat-item text-center">
                                            <span className="text-xl font-semibold text-blue-400">{councilDetails.faculty_advisor}</span>
                                            <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Faculty Advisor</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Council Image/Logo */}
                            {councilDetails && councilDetails.image ? (
                                <img
                                    src={`${BASE_URL}${councilDetails.image}`}
                                    alt={councilName}
                                    className="w-48 h-48 object-cover rounded-full border-4 border-blue-500 shadow-xl"
                                />
                            ) : (
                                <div className="w-48 h-48 bg-gray-700 flex items-center justify-center rounded-full border-4 border-blue-500 shadow-xl">
                                    <span className="text-3xl font-bold text-blue-400">
                                        {councilName.split(' ').map(word => word[0]).join('')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Add Club Button */}
                        <div className="mt-12 flex justify-center md:justify-start">
                            <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-lg transform hover:scale-105"
                                onClick={() => setShowForm(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add New Club
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Forms */}
            {showForm && (
                <ClubForm onSubmit={handleAddClub} onClose={() => setShowForm(false)} />
            )}

            {editingClub && (
                <ClubForm
                    onSubmit={handleUpdateClub}
                    onClose={() => setEditingClub(null)}
                    initialData={editingClub}
                />
            )}

            {deletingClub && (
                <DeleteConfirmation
                    clubName={deletingClub.name}
                    onConfirm={handleDeleteClub}
                    onCancel={() => setDeletingClub(null)}
                />
            )}... {/* Clubs Section */}
            {!loading && !error && (
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h2 className="text-4xl font-extrabold text-blue-500 mb-12 border-b-4 border-blue-600 pb-2 tracking-wide">Clubs and Organizations</h2>
                    {clubs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {clubs.map((club, index) => (
                                <div
                                    key={club.id}
                                    className={`club-card ${getRandomGradient(index)} rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-blue-500/40 p-6 relative flex flex-col justify-between`}
                                >
                                    {/* Club Actions */}
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <button
                                            onClick={() => setEditingClub(club)}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                            title="Edit Club"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeletingClub(club)}
                                            className="p-2 bg-white/20 hover:bg-red-500/70 rounded-full transition-colors"
                                            title="Delete Club"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    <Link
                                        to={`/clubs/${encodeURIComponent(club.name)}`}
                                        className="flex flex-col justify-between flex-grow"
                                    >
                                        <div>
                                            <div className="flex items-center mb-4">
                                                {club.image ? (
                                                    <img src={club.image} alt={club.name} className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-lg" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full border-4 border-gray-400 shadow-md">
                                                        <span className="text-2xl font-extrabold text-gray-700">
                                                            {club.name.split(' ').map(word => word[0]).join('')}
                                                        </span>
                                                    </div>
                                                )}
                                                <h3 className="text-2xl font-extrabold text-white ml-4 drop-shadow-md tracking-wide">{club.name}</h3>
                                            </div>
                                            <p className="text-white text-lg mb-6 line-clamp-3 font-semibold leading-relaxed drop-shadow-md">{club.description}</p>
                                        </div>
                                        {club.head && (
                                            <div className="text-white">
                                                <span className="text-sm text-black/90 block font-bold">Club Head</span>
                                                <span className="font-bold text-lg text-black drop-shadow-md">{typeof club.head === 'object' ? club.head.name : club.head}</span>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-12 rounded-2xl text-center shadow-lg">
                            <p className="text-gray-300 text-lg font-semibold">No clubs found for this council.</p>
                            <p className="mt-2 text-gray-400 text-sm">Click "Add New Club" to create the first one!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CouncilDetails;
