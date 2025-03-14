// components/club/ClubHead.jsx
import React from 'react';
import './styles.css';
const ClubHead = ({ club }) => {
  return (
    <>
      <h2 className="club-head-title">Club Head</h2>
      <p className="club-head-name">{club.head?.name || 'Not Assigned'}</p>
      <p className="club-head-email">{club.head?.email || ''}</p>
    </>
  );
};

export default ClubHead;
