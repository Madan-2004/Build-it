import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
        console.log(response.data)
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
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    image: null,           // For handling image uploads
    pdf: null,             // For handling PDF uploads
    status: "draft",       // Default status
    club: clubId,          // Foreign key reference
    categories: [],        // Many-to-many relationship
    register_link: "#",    // Default URL
    fees: "Free Entry",    // Default value
    contact: "info@iitindore.ac.in"  // Default contact
});
} catch (error) {
    console.error("Error creating event:", error);
}

  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: files[0]
    }));
  };
  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      categories: selectedCategories
    }));
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className={`px-6 py-4 ${darkMode ? "bg-gradient-to-r from-purple-800 to-indigo-900" : "bg-gradient-to-r from-purple-500 to-indigo-500"}`}>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-2">Start: {new Date(event.start_date).toLocaleString()}</p>
                  <p className="text-sm mb-2">End: {new Date(event.end_date).toLocaleString()}</p>
                  <p className="text-sm mb-2">Location: {event.location}</p>
                  <p className="text-sm mb-2">Description: {event.description}</p>
                  <p className="text-sm mb-2">Fees: {event.fees}</p>
                  <p className="text-sm mb-2">Contact: {event.contact}</p>

                  <a href={event.register_link} className={`block mt-4 text-center py-2 rounded-lg ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"} transition duration-150`}>
                    Register
                  </a>
                  <Link to={`/inventory/events/${event.id}/`} className={`block mt-4 text-center py-2 rounded-lg ${darkMode ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"} transition duration-150`}>
                    View Inventory
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create New Event Form */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Create New Event</h2>

          <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="block w-full mb-2 p-2 border rounded" />

          <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="block w-full mb-2 p-2 border rounded"></textarea>

          <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="block w-full mb-2 p-2 border rounded" />

          <input type="datetime-local" value={newEvent.start_date} onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })} className="block w-full mb-2 p-2 border rounded" />

          <input type="datetime-local" value={newEvent.end_date} onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })} className="block w-full mb-2 p-2 border rounded" />

          <input type="file" name="image" onChange={handleFileChange} className="block w-full mb-2 p-2 border rounded" />

          <input type="file" name="pdf" onChange={handleFileChange} className="block w-full mb-2 p-2 border rounded" />

          <select multiple onChange={handleCategoryChange} className="block w-full mb-2 p-2 border rounded">
            <option value="1">Tech</option>
            <option value="2">Cultural</option>
            <option value="3">Sports</option>
          </select>

          <input type="text" placeholder="Fees" value={newEvent.fees} onChange={(e) => setNewEvent({ ...newEvent, fees: e.target.value })} className="block w-full mb-2 p-2 border rounded" />

          <input type="email" placeholder="Contact" value={newEvent.contact} onChange={(e) => setNewEvent({ ...newEvent, contact: e.target.value })} className="block w-full mb-2 p-2 border rounded" />

          <button onClick={handleCreateEvent} className="mt-2 bg-green-500 text-white py-2 px-4 rounded">Create Event</button>
        </div>
      </div>
    </div>
  );
};

export default ClubEvents;
