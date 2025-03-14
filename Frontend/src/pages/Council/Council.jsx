import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/council.css";

function Council() {
  const [councils, setCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://127.0.0.1:8000";
  
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/councils/`)
      .then((response) => {
        setCouncils(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching councils:", error);
        setError("Failed to load councils. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Loading state with animation
  if (loading) {
    return (
      <div className="council-container">
        <h1 className="title">Council List</h1>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading councils...</p>
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="council-container">
        <h1 className="title">Council List</h1>
        <div className="error-container">
          <p className="error">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="council-container">
      <div className="council-header">
        <h1 className="title">Council List</h1>
        <p className="subtitle">Explore our diverse councils and their activities</p>
      </div>
      
      <div className="council-list">
        {councils.map((council) => (
          <Link 
            key={council.id} 
            to={`/council/${encodeURIComponent(council.name)}/clubs`} 
            className="council-card"
          >
            <div className="council-card-content">
              {council.image && (
                <div className="council-image-container">
                  <img 
                    src={`${BASE_URL}${council.image}`} 
                    alt={council.name} 
                    className="council-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-council.png"; // Fallback image
                    }}
                  />
                </div>
              )}
              <div className="council-text">
                <h2>{council.name}</h2>
                <p className="council-description">{council.description}</p>
                <div className="view-more">
                  <span>View Clubs</span>
                  <i className="arrow-icon">→</i>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Council;