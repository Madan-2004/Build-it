import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EventCard from "../Events/components/EventCard";
import EventForm from "../Events/components/EventForm";

const ClubEvents = ({ clubId, clubName, darkMode,isAdmin}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/clubs/${clubId}/events/`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [clubId]);

  const handleCreateEvent = async (formData) => {
    try {
      formData.append("club", clubId);
      const response = await axios.post(`http://localhost:8000/api/events/create/`, formData);
      setEvents((prevEvents) => [...prevEvents, response.data]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleUpdateEvent = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/events/${id}/`, updatedData);
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === id ? response.data : event))
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/events/${id}/`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-10 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <h1 className="text-3xl font-bold mb-6">Club Events</h1>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id}>
              <EventCard event={event} viewMode="grid" />
             {isAdmin&& ( <Link to={`/inventory/events/${event.id}/`} className={`block mt-4 text-center py-2 rounded-lg ${darkMode ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"} transition duration-150`}>
                View Inventory
              </Link>)}
            </div>
          ))}
        </div>

        {/* Create Event Button */}
        {isAdmin&& (  <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create New Event
          </button>
        </div>)}

        {/* Event Form Modal */}
        {isFormOpen && (
          <EventForm
            onSubmit={handleCreateEvent}
            onClose={() => setIsFormOpen(false)}
            initialData={{ club_name: clubName }} // Pass club name to lock it
            isClubLocked={true} // Ensure the club field is locked
          />
        )}
      </div>
    </div>
  );
};

export default ClubEvents;