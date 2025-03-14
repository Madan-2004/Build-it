// components/club/MemberItem.jsx
import React from 'react';
import './styles.css';
const MemberItem = ({ member, startEditMember, handleRemoveMember }) => {
  return (
    <>
      
        {member.user.name}
      
      
        {member.user.email}
        {member.status === 'head' ? 'Head' : 'Member'}
      
      <button className="edit-member-button" onClick={() => startEditMember(member)}>Edit</button>
      <button className="remove-member-button" onClick={() => handleRemoveMember(member.user.id)}>
        Remove
      </button>
    </>
  );
};

export default MemberItem;
