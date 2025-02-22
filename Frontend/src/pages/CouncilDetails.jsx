"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Changed for React
import axios from "axios";
import "../styles/councildetails.css";

const BASE_URL = "http://127.0.0.1:8000";

const ClubForm = ({ club, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: club?.name || "",
        head: club?.head || "",
        description: club?.description || "",
        upcoming_events: club?.upcoming_events || "",
        members: club?.members || "",
        projects: club?.projects || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{club ? "Edit Club" : "Add New Club"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Club Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Club Head</label>
                    <input
                        type="text"
                        name="head"
                        value={formData.head}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <label>Upcoming Events</label>
                    <input
                        type="text"
                        name="upcoming_events"
                        value={formData.upcoming_events}
                        onChange={handleChange}
                    />

                    <label>Members</label>
                    <input
                        type="text"
                        name="members"
                        value={formData.members}
                        onChange={handleChange}
                        required
                    />

                    <label>Projects</label>
                    <input
                        type="text"
                        name="projects"
                        value={formData.projects}
                        onChange={handleChange}
                    />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">{club ? "Update Club" : "Create Club"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CouncilDetails = () => {
    const { councilName } = useParams();
    const [clubs, setClubs] = useState([]);
    const [councilName1, setcouncilName1] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingClub, setEditingClub] = useState(null);

    const fetchClubs = () => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`)
            .then((response) => {
                setcouncilName1(response.data.council);
                setClubs(response.data.clubs);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching clubs:", error);
                setError("Failed to load clubs");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchClubs();
    }, [councilName]);
    
    const handleAddClub = async (formData) => {
        try {
            await axios.post(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`, formData);
            fetchClubs();
            setShowForm(false);
        } catch (error) {
            setError("Failed to add club");
            console.error("Error adding club:", error);
        }
    };

    const handleUpdateClub = async (formData) => {
        try {
            await axios.put(
                `${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/${editingClub.id}/`,
                formData
            );
            fetchClubs();
            setEditingClub(null);
            setShowForm(false);
        } catch (error) {
            setError("Failed to update club");
            console.error("Error updating club:", error);
        }
    };

    const handleDeleteClub = async (clubId) => {
        if (window.confirm("Are you sure you want to delete this club?")) {
            try {
                await axios.delete(
                    `${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/${clubId}/`
                );
                fetchClubs();
            } catch (error) {
                setError("Failed to delete club");
                console.error("Error deleting club:", error);
            }
        }
    };

    return (
        <div className="council-details-container">
            <div className="council-header">
                <h1 className="council-title">{councilName}</h1>
                <p className="council-subtitle">Student Clubs & Organizations</p>
                <button className="btn-add" onClick={() => {
                    setEditingClub(null);
                    setShowForm(true);
                }}>
                    Add New Club
                </button>
            </div>

            {showForm && (
                <ClubForm
                    club={editingClub}
                    onSubmit={editingClub ? handleUpdateClub : handleAddClub}
                    onClose={() => setShowForm(false)}
                />
            )}

            {loading && (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading clubs...</p>
                </div>
            )}

            {error && <div className="error-state">{error}</div>}

            {!loading && !error && (
                <div className="clubs-grid">
                    {clubs.map((club) => (
                        <div key={club.id} className="club-card">
                            <h3>{club.name}</h3>
                            <p>{club.description}</p>
                            <button onClick={() => {
                                setEditingClub(club);
                                setShowForm(true);
                            }}>
                                Edit
                            </button>
                            <button onClick={() => handleDeleteClub(club.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CouncilDetails;
