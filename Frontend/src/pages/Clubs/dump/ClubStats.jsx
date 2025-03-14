// components/club/ClubStats.jsx
import React from 'react';
import './styles.css';
const ClubStats = ({ club }) => {
  return (
    <>
      <h2 className="club-stats-title">Club Statistics</h2>
      
        Members: {club.members?.length || 0}
      
      
        Founded: 2023
      
    </>
  );
};

export default ClubStats;
