import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/council.css"; // Ensure this file has card styles

const BASE_URL = "http://127.0.0.1:8000"; 

const CouncilDetails = () => {
  const { councilId } = useParams();
  const [clubs, setClubs] = useState([]);
  const [councilName, setCouncilName] = useState("");

  useEffect(() => {
    axios.get(`${BASE_URL}/api/council/${councilId}/clubs/`)
      .then((response) => {
        setCouncilName(response.data.council);
        setClubs(response.data.clubs);
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error);
      });
  }, [councilId]);

  return (
    <div className="council-details">
      <h1 className="title">{councilName} - Clubs</h1>
      <div className="club-list">
        {clubs.map((club) => (
          <div key={club.id} className="club-card">
            <div className="club-header">
              <h3>{club.name}</h3>
              <p className="club-head"><strong>Head:</strong> {club.head}</p>
            </div>
            <p className="club-description">{club.description}</p>
            <p className="club-description">{club.projects}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouncilDetails;
