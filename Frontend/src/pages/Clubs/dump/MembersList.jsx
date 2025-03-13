// components/club/MembersList.jsx
import React from 'react';
import MemberItem from './MemberItem';
import MemberEditForm from './MemberEditForm';
import './styles.css';
const MembersList = ({
  club,
  startEditMember,
  handleRemoveMember,
  memberEditMode,
  editMemberData,
  setEditMemberData,
  handleUpdateMember,
}) => {
  return (
    <>
      <h2 className="members-list-title">Members</h2>
      {club.members && club.members.length > 0 ? (
        <>
          {club.members.map((member) =>
            member.user.id === memberEditMode ? (
              <MemberEditForm
                key={member.user.id}
                member={member}
                editMemberData={editMemberData}
                setEditMemberData={setEditMemberData}
                handleUpdateMember={handleUpdateMember}
                setMemberEditMode={setMemberEditMode}
              />
            ) : (
              <MemberItem
                key={member.user.id}
                member={member}
                startEditMember={startEditMember}
                handleRemoveMember={handleRemoveMember}
              />
            )
          )}
        </>
      ) : (
        <>
          <p className="no-members-message">No members have been added to this club yet.</p>
        </>
      )}
    </>
  );
};

export default MembersList;
