import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'react-feather';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import ViewToggle from './components/ViewToggle';
import EventForm from './components/EventForm';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', date: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/events`, { params: filters });
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const createEvent = async (newEvent) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, newEvent);
      setEvents([...events, response.data]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/events/${updatedEvent.id}`, updatedEvent);
      setEvents(events.map(event => (event.id === updatedEvent.id ? response.data : event)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Discover Exciting Events</h1>
          <p className="text-md mb-4">Explore a wide range of events tailored to your interests.</p>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {showForm && (
          <div className="mb-8">
            <EventForm
              onSubmit={createEvent}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-8">
              <EventFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* Events Grid/List */}
          <main className="flex-1">
            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
                  <div className="mt-4 text-gray-600 text-center">Loading events...</div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
                <div className="font-medium">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-500 mb-2">No events found</div>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters or create a new event
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }>
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    viewMode={viewMode}
                    onEdit={updateEvent}
                    onDelete={deleteEvent}
                  />
                ))}
              </div>
            )}

            {/* Pagination - Optional */}
            {events.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  {/* Add pagination controls if needed */}
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Event Discovery Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}