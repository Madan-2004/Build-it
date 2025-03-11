// ClubProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ClubHeader from './ClubHeader';
import ClubEditForm from './ClubEditForm';
import ClubHead from './ClubHead';
import ClubStats from './ClubStats';
import MembersList from './MembersList';
import AddMemberDialog from './AddMemberDialog';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { isValidIITIEmail } from './utils/validators';
import './styles.css';
import {
  fetchClubDetails,
  updateClub,
  addMember,
  updateMember,
  removeMember,
  deleteClub,
} from './utils/api';

const ClubProfile = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'member',
  });
  const [editMode, setEditMode] = useState(false);
  const [editClub, setEditClub] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
  });
  const [memberEditMode, setMemberEditMode] = useState(null);
  const [editMemberData, setEditMemberData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    loadClubDetails();
  }, [clubName]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const loadClubDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchClubDetails(clubName);
      setClub(data);
      setEditClub({
        name: data.name,
        description: data.description || '',
        website: data.website || '',
        email: data.email || '',
      });
    } catch (err) {
      console.error('Error fetching club details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();
    if (!editClub.name.trim()) {
      alert('Club name cannot be empty');
      return;
    }
    try {
      const updatedClub = await updateClub(clubName, {
        name: editClub.name,
        description: editClub.description,
        website: editClub.website,
        email: editClub.email,
        head_id: club.head?.id || null,
      });
      setClub(updatedClub);
      setEditMode(false);
      if (updatedClub.name !== clubName) {
        navigate(`/clubs/${encodeURIComponent(updatedClub.name)}`);
      }
    } catch (err) {
      console.error('Error updating club:', err);
      alert(`Error updating club: ${err.message}`);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) {
      alert('Name and email are required');
      return;
    }
    if (!isValidIITIEmail(newMember.email)) {
      alert('Invalid email! Only @iiti.ac.in emails are allowed.');
      return;
    }
    try {
      const updatedClub = await addMember(club.id, newMember);
      setClub(updatedClub);
      setNewMember({ name: '', email: '', role: 'member' });
      setAddMemberDialogOpen(false);
    } catch (err) {
      console.error('Error adding member:', err);
      alert(`Error adding member: ${err.message}`);
    }
  };

  const startEditMember = (member) => {
    setMemberEditMode(member.user.id);
    setEditMemberData({
      name: member.user.name,
      email: member.user.email,
      role: member.status,
    });
  };

  const handleUpdateMember = async (userId) => {
    if (!editMemberData.name.trim() || !editMemberData.email.trim()) {
      alert('Name and email are required');
      return;
    }
    if (!isValidIITIEmail(editMemberData.email)) {
      alert('Invalid email! Only @iiti.ac.in emails are allowed.');
      return;
    }
    try {
      const updatedClub = await updateMember(club.id, userId, editMemberData);
      setClub(updatedClub);
      setMemberEditMode(null);
    } catch (err) {
      console.error('Error updating member:', err);
      alert(`Error updating member: ${err.message}`);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }
    try {
      const updatedClub = await removeMember(club.id, userId);
      setClub(updatedClub);
    } catch (err) {
      console.error('Error removing member:', err);
      alert(`Error removing member: ${err.message}`);
    }
  };

  const handleCloseDialogBackdrop = () => {
    setAddMemberDialogOpen(false);
  };

  const handleDeleteClub = async () => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await deleteClub(clubName);
      alert('Club deleted successfully');
      navigate('/clubs');
    } catch (err) {
      console.error('Error deleting club:', err);
      alert(`Error deleting club: ${err.message}`);
    }
  };

  //for future purpose features
  const renameClub = async (newName) => {
    try {
      // Omitted to reduce code
    } catch (err) {
      // Omitted to reduce code
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    
      <>
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        <ClubHeader
          club={club}
          setEditMode={setEditMode}
          handleDeleteClub={handleDeleteClub}
        />
        {editMode ? (
          <ClubEditForm
            editClub={editClub}
            setEditClub={setEditClub}
            handleUpdateClub={handleUpdateClub}
            setEditMode={setEditMode}
          />
        ) : (
            <>
            <ClubHead club={club} />
            <ClubStats club={club} />
            </>
          
        )}

        <MembersList
          club={club}
          startEditMember={startEditMember}
          handleRemoveMember={handleRemoveMember}
          memberEditMode={memberEditMode}
          editMemberData={editMemberData}
          setEditMemberData={setEditMemberData}
          handleUpdateMember={handleUpdateMember}
        />

        <button className="add-member-button" onClick={() => setAddMemberDialogOpen(true)}>
          Add New Member
        </button>
        <AddMemberDialog
          open={addMemberDialogOpen}
          handleClose={handleCloseDialogBackdrop}
          newMember={newMember}
          setNewMember={setNewMember}
          handleAddMember={handleAddMember}
        />
      </>
    
  );
};

export default ClubProfile;
