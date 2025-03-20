"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/councildetails.css";
import { motion } from "framer-motion";

const BASE_URL = "http://127.0.0.1:8000";

const ClubForm = ({ onSubmit, onClose, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        head: initialData?.head || "",
        description: initialData?.description || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Club name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when field is edited
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-content bg-gray-800 text-white rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-blue-400">
                    {initialData ? "Edit Club" : "Add New Club"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {[
                        { name: "name", label: "Club Name", type: "text" },
                        { name: "description", label: "Description", type: "textarea" }
                    ].map((field) => (
                        <div key={field.name} className="form-group mb-4">
                            <label className="block text-blue-300 mb-2 uppercase text-sm tracking-wider">
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className={`w-full bg-gray-700 border ${errors[field.name] ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-700 border ${errors[field.name] ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                            )}
                            {errors[field.name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                    <div className="modal-actions flex justify-end mt-6 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                initialData ? "Update Club" : "Create Club"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const DeleteConfirmation = ({ clubName, onConfirm, onCancel }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Delete error:", error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
                        <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-white">Delete Club</h2>
                    <p className="mb-6 text-gray-300">
                        Are you sure you want to delete <span className="font-semibold text-white">{clubName}</span>?
                        <br />
                        <span className="text-red-400">This action cannot be undone.</span>
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center disabled:opacity-50"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Club
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Skeleton loader for club cards
const ClubCardSkeleton = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg animate-pulse">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
            <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="p-6">
            <div className="h-24 bg-gray-700 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-16 bg-gray-700 rounded-lg"></div>
                <div className="h-16 bg-gray-700 rounded-lg"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-10 bg-gray-700 rounded-lg w-32"></div>
                <div className="h-10 bg-gray-700 rounded-lg w-10"></div>
            </div>
        </div>
    </div>
);

const CouncilDetails = () => {
    const { councilName } = useParams();
    const [councilDetails, setCouncilDetails] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deletingClub, setDeletingClub] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const fetchCouncilData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch council details
            const councilResponse = await axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/`);
            setCouncilDetails(councilResponse.data);
            
            // Fetch clubs for this council
            const clubsResponse = await axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`);
            setClubs(clubsResponse.data.clubs);
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching council data:", error);
            setError(error.response?.data?.message || "Failed to load council data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouncilData();
    }, [councilName]);

    // Create new club
    const handleAddClub = async (formData) => {
        try {
            await axios.post(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`, formData);
            await fetchCouncilData();
            showNotification(`Club "${formData.name}" has been created successfully!`);
            return true;
        } catch (error) {
            console.error("Error adding club:", error);
            setError(error.response?.data?.message || "Failed to create club. Please try again.");
            return false;
        }
    };

    // Update the handleDeleteClub function
    const handleDeleteClub = async () => {
        try {
            console.log('Attempting to delete club:', deletingClub.id);
            const response = await axios.delete(
                `${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/${deletingClub.id}/`
            );

            if (response.status === 204 || response.status === 200) {
                await fetchCouncilData();
                showNotification(`Club "${deletingClub.name}" has been deleted successfully!`, "success");
                setDeletingClub(null);
                return true;
            } else {
                setError(`Failed to delete club. Server returned status: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error('Delete club error:', error.response || error);
            setError(
                error.response?.data?.message ||
                "Failed to delete club. Please try again."
            );
            return false;
        }
    };

    // Function to get a random gradient background for each club
    const gradients = [
        "bg-gradient-to-br from-blue-500 to-teal-400", 
        "bg-gradient-to-br from-purple-500 to-pink-500", 
        "bg-gradient-to-br from-amber-500 to-orange-500", 
        "bg-gradient-to-br from-emerald-500 to-lime-500", 
        "bg-gradient-to-br from-sky-500 to-indigo-500"
    ];

    const getRandomGradient = (index) => {
        return gradients[index % gradients.length];
    };

    // Generate skeleton loaders for loading state
    const skeletons = Array.from({ length: 8 }, (_, i) => <ClubCardSkeleton key={i} />);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Notification component */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                        notification.type === "success" ? "bg-green-600" : "bg-red-600"
                    } text-white flex items-center max-w-md`}
                >
                    <div className="mr-3">
                        {notification.type === "success" ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <p>{notification.message}</p>
                    <button 
                        onClick={() => setNotification(null)}
                        className="ml-auto text-white hover:text-gray-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}

            {/* Full width hero section for council details */}
            <div className="council-hero w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-blue-400">Loading council data...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <div className="bg-red-900/60 backdrop-blur-sm border-l-4 border-red-500 text-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-medium">{error}</p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={() => fetchCouncilData()}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4 py-16 relative">
                        {/* Subtle background pattern */}
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
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
                                <div className="inline-flex gap-8 bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50">
                                    <div className="stat-item text-center">
                                        <span className="text-4xl font-bold text-blue-400">{clubs.length}</span>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Total Clubs</p>
                                    </div>

                                    {councilDetails && councilDetails.established && (
                                        <div className="stat-item text-center">
                                            <span className="text-4xl font-bold text-blue-400">{councilDetails.established}</span>
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
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    src={`${BASE_URL}${councilDetails.image}`}
                                    alt={councilName}
                                    className="w-48 h-48 object-cover rounded-full border-4 border-blue-500 shadow-xl"
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-48 h-48 bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center rounded-full border-4 border-blue-500 shadow-xl"
                                >
                                    <span className="text-3xl font-bold text-white">
                                        {councilName.split(' ').map(word => word[0]).join('')}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                       {/* Add Club Button */}
<div className="flex justify-center md:justify-start mt-12">
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-lg"
        onClick={() => { 
            console.log("Button clicked!");
            setShowForm(true);
        }}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add New Club
    </motion.button>
</div>

                    </div>
                )}
            </div>

            {/* Modal Forms */}
            {showForm && (
                <ClubForm onSubmit={handleAddClub} onClose={() => setShowForm(false)} />
            )}

            {deletingClub && (
                <DeleteConfirmation
                    clubName={deletingClub.name}
                    onConfirm={handleDeleteClub}
                    onCancel={() => setDeletingClub(null)}
                />
            )}

            {/* Clubs Section */}
            <div className="w-full relative">
                {/* Background with full width */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 via-gray-900/70 to-gray-900"></div>

                {/* Content container with max width */}
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 text-transparent bg-clip-text">
                            Our Vibrant Clubs
                        </h2>
                        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-4"></div>
                        <p className="text-blue-300 text-lg mt-4">Explore and join our diverse community</p>
                    </div>

                    {/* Clubs Grid with wider max-width */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {skeletons}
                        </div>
                    ) : clubs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {clubs.map((club, index) => (
                                <motion.div
                                    key={club.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg"
                                >
                                    {/* Club Header */}
                                    <div className={`${getRandomGradient(index)} p-6`}>
                                        <h3 className="text-xl font-bold text-white mb-2 truncate">
                                            {club.name}
                                        </h3>
                                        {club.head && (
                                            <div className="flex items-center text-white text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                                                </svg>
                                                <span className="truncate font-medium">
                                                    {typeof club.head === "object" ? club.head.name : club.head}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Club Content */}
                                    <div className="p-6">
                                        <p className="text-gray-300 text-sm line-clamp-3 mb-6">
                                            {club.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
                                                <div className="text-blue-400 text-lg font-bold">
                                                    {club.members_count || 0}
                                                </div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">
                                                    Members
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
                                                <div className="text-blue-400 text-lg font-bold">
                                                    {club.projects_count || 0}
                                                </div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">
                                                    Projects
                                                </div>
                                            </div>
                                        </div>

                                       

                                            {/* Actions */}
                                            <div className="flex justify-between items-center">
                                                <Link
                                                    to={`/clubs/${encodeURIComponent(club.name)}`}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    View Details
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>

                                                <button
                                                    onClick={() => setDeletingClub(club)}
                                                    className="p-2 text-gray-400 hover:text-red-400 transition-colors group"
                                                    title="Delete Club"
                                                >
                                                    <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-700/50 relative"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Clubs Yet</h3>
                                <p className="text-gray-400 mb-6">Be the first to create a club in this council!</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create First Club
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            
        </div>
    );
};

export default CouncilDetails;
