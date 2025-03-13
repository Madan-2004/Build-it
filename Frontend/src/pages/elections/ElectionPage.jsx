import React, { useState, useEffect } from 'react';
import ElectionTable from './ElectionTable'; // Adjusted to import from the correct path

const ElectionPage = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });

  // Example of fetching election data (this can be replaced with an actual API call)
  useEffect(() => {
    setElections({
      ongoing: [
        { id: "001", name: "Student Body President", date: "2025-03-12", status: "ongoing" },
        { id: "002", name: "Class Representative", date: "2025-03-15", status: "ongoing" },
      ],
      upcoming: [
        { id: "003", name: "Sports Captain", date: "2025-03-20", status: "upcoming" },
        { id: "004", name: "Cultural Secretary", date: "2025-03-25", status: "upcoming" },
      ],
      past: [
        { id: "005", name: "Student Body Vice President", date: "2025-03-05", status: "past" },
        { id: "006", name: "Secretary General", date: "2025-03-01", status: "past" },
      ],
    });
  }, []);

  const handleAction = (election) => {
    if (election.status === 'ongoing') {
      window.location.href = `/vote/${election.id}`;
    } else if (election.status === 'past') {
      window.location.href = `/results/${election.id}`;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Elections</h1>

      {/* Ongoing Elections */}
      <div className="mb-6">
        <ElectionTable
          title="Ongoing Elections"
          elections={elections.ongoing}
          handleAction={handleAction}
        />
      </div>

      {/* Upcoming Elections */}
      <div className="mb-6">
        <ElectionTable
          title="Upcoming Elections"
          elections={elections.upcoming}
          handleAction={handleAction}
        />
      </div>

      {/* Past Elections */}
      <div className="mb-6">
        <ElectionTable
          title="Past Elections"
          elections={elections.past}
          handleAction={handleAction}
        />
      </div>
    </div>
  );
};

export default ElectionPage;
