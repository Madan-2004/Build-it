import React, { useEffect, useState } from "react";
import axios from "axios";

const ClubEvents = ({ clubId, darkMode }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/clubs/${clubId}/events/`);
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [clubId]);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"} pb-10 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"} pb-10`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <h1 className="text-3xl font-bold mb-6">Club Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`px-6 py-4 ${darkMode ? "bg-gradient-to-r from-purple-800 to-indigo-900" : "bg-gradient-to-r from-purple-500 to-indigo-500"}`}>
                <h2 className="text-xl font-bold text-white">{event.title}</h2>
              </div>
              <div className="p-4">
                <p className="text-sm mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm mb-2">Venue: {event.venue}</p>
                <p className="text-sm mb-2">Category: {event.category}</p>
                <p className="text-sm mb-2">Description: {event.description}</p>
                <a href={event.register_link} className={`block mt-4 text-center py-2 rounded-lg ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"} transition duration-150`}>
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubEvents;