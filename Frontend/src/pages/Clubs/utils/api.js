// utils/api.js
const API_BASE_URL = 'http://localhost:8000';

export const fetchClubDetails = async (clubName) => {
  const response = await fetch(
    `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/`
  );
  if (!response.ok) {
    throw new Error(`Club not found (Status: ${response.status})`);
  }
  return response.json();
};

export const updateClub = async (clubName, data) => {
  const response = await fetch(
    `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/update/`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update club');
  }
  return response.json();
};

export const addMember = async (clubId, memberData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/clubs/${clubId}/add-member/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add member');
  }
  return response.json();
};

export const updateMember = async (clubId, userId, memberData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/clubs/${clubId}/edit-member/${userId}/`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update member');
  }
  return response.json();
};

export const removeMember = async (clubId, userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/clubs/${clubId}/remove-member/${userId}/`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to remove member');
  }
  return response.json();
};

export const deleteClub = async (clubName) => {
  const response = await fetch(
    `${API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/delete/`,
    {
      method: 'DELETE',
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete club');
  }
};
