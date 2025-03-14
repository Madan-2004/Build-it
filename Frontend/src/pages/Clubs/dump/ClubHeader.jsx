// components/club/ClubHeader.jsx
import React from 'react';
import './styles.css';
const ClubHeader = ({ club, setEditMode, handleDeleteClub }) => {
  return (
    <>
      <h1 className="club-title">{club.name}</h1>
      <p className="club-description">{club.description || 'No description available.'}</p>
      <p className="club-website">
        <strong>Club Website:</strong> {club.website || 'Not Available'}
      </p>
      <p className="club-email">
        <strong>Club Email:</strong> {club.email || 'Not Available'}
      </p>
      <button className="edit-button" onClick={() => setEditMode(true)}>Edit Club</button>
      <button className="delete-button" onClick={handleDeleteClub}>Delete Club</button>
    </>
  );
};

export default ClubHeader;
