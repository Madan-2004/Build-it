"use client";

import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
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
                    {["name", "head", "description", "upcoming_events", "members", "projects"].map((field) => (
                        <div key={field}>
                            <label>{field.replace("_", " ").toUpperCase()}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required={field !== "upcoming_events" && field !== "projects"}
                            />
                        </div>
                    ))}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-submit">{club ? "Update" : "Create"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CouncilDetails = () => {
    const { councilName } = useParams();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingClub, setEditingClub] = useState(null);

    const fetchClubs = () => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`)
            .then((response) => {
                setClubs(response.data.clubs);
                console.log(response.data.clubs);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to load clubs");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchClubs();
    }, [councilName]);

    const handleAddOrUpdateClub = async (formData) => {
        try {
            if (editingClub) {
                await axios.put(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/${editingClub.id}/`, formData);
            } else {
                await axios.post(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/`, formData);
            }
            fetchClubs();
            setShowForm(false);
            setEditingClub(null);
        } catch (error) {
            setError("Failed to save club");
        }
    };

    const handleDeleteClub = async (clubId) => {
        if (window.confirm("Are you sure you want to delete this club?")) {
            try {
                await axios.delete(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/clubs/${clubId}/`);
                fetchClubs();
            } catch (error) {
                setError("Failed to delete club");
            }
        }
    };

    return (
        <div className="council-details-container">
            <div className="council-header">
                <h1 className="council-title">{councilName}</h1>
                <p className="council-subtitle">Student Clubs & Organizations</p>
                <button className="btn-add" onClick={() => { setEditingClub(null); setShowForm(true); }}>
                    + Add Club
                </button>
            </div>

            {showForm && (
                <ClubForm club={editingClub} onSubmit={handleAddOrUpdateClub} onClose={() => setShowForm(false)} />
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading clubs...</p>
                </div>
            ) : error ? (
                <div className="error-state">{error}</div>
            ) : (
                <div className="clubs-grid">
                {clubs.map((club) => (
                  <div key={club.id} className="club-card shadow-lg rounded-lg overflow-hidden bg-white flex p-4 hover:shadow-2xl transition-shadow">
                    {/* Club Image on the Left */}
                    {club.image ? (
                      <img src={club.image} alt={club.name} className="w-32 h-32 object-cover rounded-lg" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
              
                    {/* Club Details on the Right */}
                    <div className="flex flex-col justify-between flex-grow ml-4">
                      <div>
                        <Link to={`/clubs/${encodeURIComponent(club.name)}`} className="text-xl font-bold text-blue-600 hover:underline">
                          {club.name}
                        </Link>
                        <p className="text-gray-700 text-sm mt-1">
                            {club.description.length > 100 ? `${club.description.slice(0, 100)}...` : club.description}
                        </p>
                      </div>
              
                      {/* Club Head */}
                      {club.head && (
                        <p className="text-gray-600 text-sm mt-2">
                          <strong>Head:</strong> {club.head.name}
                        </p>
                      )}
              
                      {/* Club Actions */}
                      <div className="mt-4 flex gap-3">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={() => { setEditingClub(club); setShowForm(true); }}>
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={() => handleDeleteClub(club.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            )}
        </div>
    );
};

export default CouncilDetails;
