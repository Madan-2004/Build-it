// components/club/MemberEditForm.jsx
import React from 'react';
import './styles.css';
const MemberEditForm = ({
  member,
  editMemberData,
  setEditMemberData,
  handleUpdateMember,
  setMemberEditMode,
}) => {
  return (
    <>
      
        
          <label className="form-label">Name:</label>
          <input
            type="text"
            value={editMemberData.name}
            onChange={(e) =>
              setEditMemberData({ ...editMemberData, name: e.target.value })
            }
            className="form-input"
          />
        
        
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={editMemberData.email}
            onChange={(e) =>
              setEditMemberData({ ...editMemberData, email: e.target.value })
            }
            className="form-input"
          />
        
        
          <label className="form-label">Role:</label>
          <select
            value={editMemberData.role}
            onChange={(e) =>
              setEditMemberData({ ...editMemberData, role: e.target.value })
            }
            className="form-select"
          >
            <option value="member">Member</option>
            <option value="head">Head</option>
          </select>
        
        <button className="update-member-button" onClick={() => handleUpdateMember(member.user.id)}>
          Update Member
        </button>
        <button className="cancel-button" onClick={() => setMemberEditMode(null)}>Cancel</button>
      
    </>
  );
};

export default MemberEditForm;
