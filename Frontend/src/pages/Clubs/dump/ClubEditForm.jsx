// components/club/ClubEditForm.jsx
import React from 'react';
import './styles.css';
const ClubEditForm = ({
  editClub,
  setEditClub,
  handleUpdateClub,
  setEditMode,
}) => {
  return (
    <>
      <h2 className="edit-form-title">Edit Club Details</h2>
      
        
          <label className="form-label">Club Name:</label>
          <input
            type="text"
            value={editClub.name}
            onChange={(e) =>
              setEditClub({ ...editClub, name: e.target.value })
            }
            className="form-input"
          />
        
        
          <label className="form-label">Description:</label>
          <textarea
            value={editClub.description}
            onChange={(e) =>
              setEditClub({ ...editClub, description: e.target.value })
            }
            className="form-textarea"
          />
        
        
          <label className="form-label">Website:</label>
          <input
            type="text"
            value={editClub.website}
            onChange={(e) =>
              setEditClub({ ...editClub, website: e.target.value })
            }
            className="form-input"
          />
        
        
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={editClub.email}
            onChange={(e) =>
              setEditClub({ ...editClub, email: e.target.value })
            }
            className="form-input"
          />
        
        <button type="submit" className="update-button">Update Club</button>
        <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
      
    </>
  );
};

export default ClubEditForm;
