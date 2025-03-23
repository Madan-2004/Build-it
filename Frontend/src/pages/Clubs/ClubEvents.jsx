import React, { useEffect, useState } from "react";
import axios from "axios";

const ClubEvents = ({ clubId, darkMode }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    poster: "",
    description: "",
    venue: "",
    category: "",
    register_link: "",
    fees: "",
    schedule: "",
    contact: "",
    club: clubId,
  });

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

  const handleCreateEvent = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/events/`, newEvent);
      setEvents([...events, response.data]);
      setNewEvent({
        title: "",
        date: "",
        poster: "",
        description: "",
        venue: "",
        category: "",
        register_link: "",
        fees: "",
        schedule: "",
        contact: "",
        club: clubId,
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleUpdateEvent = async (id, updatedEvent) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/events/${id}/`, updatedEvent);
      setEvents(events.map(event => (event.id === id ? response.data : event)));
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/events/${id}/`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

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
                <button onClick={() => handleUpdateEvent(event.id, { ...event, title: "Updated Title" })} className="mt-2 bg-yellow-500 text-white py-1 px-2 rounded">Update</button>
                <button onClick={() => handleDeleteEvent(event.id)} className="mt-2 bg-red-500 text-white py-1 px-2 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
          <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <input type="date" placeholder="Date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="block w-full mb-2 p-2 border rounded"></textarea>
          <input type="text" placeholder="Register Link" value={newEvent.register_link} onChange={(e) => setNewEvent({ ...newEvent, register_link: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <input type="text" placeholder="Fees" value={newEvent.fees} onChange={(e) => setNewEvent({ ...newEvent, fees: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <input type="text" placeholder="Schedule" value={newEvent.schedule} onChange={(e) => setNewEvent({ ...newEvent, schedule: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <input type="email" placeholder="Contact" value={newEvent.contact} onChange={(e) => setNewEvent({ ...newEvent, contact: e.target.value })} className="block w-full mb-2 p-2 border rounded" />
          <button onClick={handleCreateEvent} className="mt-2 bg-green-500 text-white py-2 px-4 rounded">Create Event</button>
        </div>
      </div>
    </div>
  );
};

export default ClubEvents;