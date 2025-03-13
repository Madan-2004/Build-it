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
    const gradients = [
        "bg-gradient-to-br from-[#3498db] to-[#2ecc71]", // Blue to Green
        "bg-gradient-to-br from-[#e74c3c] to-[#c0392b]", // Red to Deep Red
        "bg-gradient-to-br from-[#9b59b6] to-[#8e44ad]", // Purple to Deep Purple
        "bg-gradient-to-br from-[#1abc9c] to-[#16a085]", // Teal to Deep Teal
        "bg-gradient-to-br from-[#f1c40f] to-[#e67e73]", // Yellow to Orange
    ];
    
    const getRandomGradient = (index) => {
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
             // Card component with improved dimensions and styling
<div className="max-w-7xl mx-auto px-6 py-12 relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 -z-10"></div>

    {/* Section Title */}
    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-12 text-center tracking-tight">
        Clubs and Organizations
    </h2>

    {clubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
                <div
                    key={club.id}
                    className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex flex-col h-64 border border-gray-700/50"
                >
                    {/* Club Content */}
                    <div className="p-5 flex flex-col h-full relative">
                        {/* Club Badge & Name */}
                        <div className="flex items-center mb-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold shadow-md border border-blue-400/40">
                                {club.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            <h3 className="text-lg font-bold text-white ml-3 truncate">{club.name}</h3>
                        </div>

                        {/* Club Description */}
                        <p className="text-gray-400 text-sm h-16 overflow-hidden leading-relaxed">
                            {club.description}
                        </p>

                     {/* Club Head Section */}
{club.head && (
    <div className="mt-auto bg-gray-800/50 p-3 rounded-lg text-sm border-l-4 border-blue-400/60 shadow-inner">
        <span className="block text-blue-400 text-xs uppercase font-semibold mb-1 tracking-wider">
            Club Head
        </span>
        <span className="font-bold text-white truncate">
            {typeof club.head === "object" ? club.head.name : club.head}
        </span>
    </div>
)}


                   {/* View Details Button */}
<div className="mt-3 flex justify-end">
    <Link
        to={`/clubs/${encodeURIComponent(club.name)}`}
        className="text-blue-400 text-sm font-medium flex items-center group-hover:text-blue-300 transition-colors duration-300"
    >
        View Details
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    </Link>
</div>

                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div className="bg-white/10 p-8 rounded-xl text-center shadow-lg backdrop-blur-md">
            <p className="text-white text-lg font-bold mb-3">No clubs found for this council.</p>
            <p className="text-white/70 text-sm">Click "Add New Club" to create the first one!</p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                Add New Club
            </button>
        </div>
    )}
</div>


           
           
            )}
        </div>
    );
};

export default CouncilDetails;
