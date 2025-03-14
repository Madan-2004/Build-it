// components/club/AddMemberDialog.jsx
import React from 'react';
import './styles.css';
const AddMemberDialog = ({
  open,
  handleClose,
  newMember,
  setNewMember,
  handleAddMember,
}) => {
  if (!open) return null;

  return (
    <>
      
        
          <h2 className="add-member-title">Add New Member</h2>
          
            
              <label className="form-label">Name:</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                className="form-input"
              />
            
            
              <label className="form-label">Email:</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                className="form-input"
              />
            
            
              <label className="form-label">Role:</label>
              <select
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
                className="form-select"
              >
                <option value="member">Member</option>
                <option value="head">Head</option>
              </select>
            
            <button type="submit" className="add-button">Add Member</button>
            <button className="cancel-button" onClick={handleClose}>Cancel</button>
          
        
      
    </>
  );
};

export default AddMemberDialog;
