import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/council.css"; // ✅ Ensure you have this CSS file

function Council() {
  const [councils, setCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://127.0.0.1:8000";  

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/councils/`) // Fetch councils list
      .then((response) => {
        setCouncils(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching councils:", error);
        setError("Failed to load councils.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="council-container">
      <h1 className="title">Council List</h1>

      {loading && <p>Loading councils...</p>}
      {error && <p className="error">{error}</p>}

      <div className="council-list">
        {councils.map((council) => (
         <Link key={council.id} to={`/council/${encodeURIComponent(council.name)}/clubs`} className="council-card">
         <h2>{council.name}</h2>
         <p>{council.description}</p>
         {council.image && <img src={`${BASE_URL}${council.image}`} alt={council.name} />}
       </Link>       
        ))}
      </div>
    </div>
  );
}

export default Council;
