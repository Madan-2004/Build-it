import React, { useState, useEffect } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import * as S from "./EventadminElements";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background 0.3s ease;
  }
`;

const lightTheme = {
  background: "#f8f9fa", // Soft off-white for comfort
  text: "#002147", // Deep navy blue for professional contrast
  cardBackground: "#ffffff", // Clean white for cards
  borderColor: "#d1d9e6", // Soft blue-gray borders
  categoryButton: "#007BFF", // Classic blue for category buttons
  categoryButtonText: "#ffffff", // White text for buttons
  eventTitle: "#003366", // Deeper blue for event titles
  eventDescription: "#333333", // Dark gray for better readability
  eventVenue: "#555555", // Subtle gray for venue details
  cardShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadows for depth
};

const darkTheme = {
  background: "#121212", // Pure black for modern look
  text: "#E0E0E0", // Light gray for text clarity
  cardBackground: "#1E1E1E", // Dark gray for smooth contrast
  borderColor: "#444", // Subtle dark gray borders
  categoryButton: "#1E90FF", // Lighter blue for pop effect
  categoryButtonText: "#ffffff", // White for visibility
  eventTitle: "#00A6FF", // Neon blue for high focus
  eventDescription: "#B0B0B0", // Light gray for readability
  eventVenue: "#AAAAAA", // Soft gray for venue details
  cardShadow: "0 6px 15px rgba(0, 166, 255, 0.15)", // Soft blue glow effect
};

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const navigate = useNavigate();

  const categories = ["Technical", "Cultural", "Sports", "Workshops"];
  
  const [newEvent, setNewEvent] = useState({
    poster: "",
    agenda: { time: "", topic: "" },
    speaker: { name: "", bio: "" },
    club_name: "",
    title: "",
    date: "",
    description: "",
    venue: "",
    category: "Technical",
    register_link: "",
    fees: "",
    schedule: "",
    contact: "",
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/events/");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddOrEditEvent = async () => {
    try {
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent
        ? `http://127.0.0.1:8000/api/events/update/${editingEvent.id}/`
        : "http://127.0.0.1:8000/api/events/create/";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error("Failed to save event");

      const updatedEvent = await response.json();
      if (editingEvent) {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
      } else {
        setEvents([...events, updatedEvent]);
      }

      setNewEvent({
        poster: "",
        agenda: { time: "", topic: "" },
        speaker: { name: "", bio: "" },
        club_name: "",
        title: "",
        date: "",
        description: "",
        venue: "",
        category: "Technical",
        register_link: "",
        fees: "",
        schedule: "",
        contact: "",
      });

      setEditingEvent(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/events/delete/${id}/`, { method: "DELETE" });
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  let filteredEvents = events
    .filter(
      (event) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || event.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "venue") return a.venue.localeCompare(b.venue);
      return 0;
    });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <S.EventsContainer>
        <S.HeroSection>
          <S.HeroTitle>Event Management</S.HeroTitle>
          <S.ThemeToggle onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? "🌞" : "🌙"}
          </S.ThemeToggle>
        </S.HeroSection>

        <S.FilterSection>
          <S.SearchInput
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <S.CategoryFilter>
            {["All", ...categories].map((cat) => (
              <S.CategoryButton
                key={cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </S.CategoryButton>
            ))}
          </S.CategoryFilter>
        </S.FilterSection>

        <S.StyledButton onClick={handleAddNewEvent}>
          {showForm && !editingEvent ? "Close Form" : "+ Add Event"}
        </S.StyledButton>

        {showForm && (
          <S.EventFormContainer>
            <S.StyledInput
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <S.StyledInput
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />
            <S.StyledInput
              type="text"
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) =>
                setNewEvent({ ...newEvent, venue: e.target.value })
              }
            />
            <S.StyledInput type="text" placeholder="Club Name" value={newEvent.club_name}
              onChange={(e) => setNewEvent({ ...newEvent, club_name: e.target.value })} />
            
            <S.StyledLabel>Category</S.StyledLabel>
            <S.StyledSelect
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </S.StyledSelect>

            <S.StyledTextArea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <S.StyledInput
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewEvent({ ...newEvent, poster: e.target.files[0] })
              }
            />

            <S.StyledInput
              type="text"
              placeholder="Register Link"
              value={newEvent.register_link}
              onChange={(e) =>
                setNewEvent({ ...newEvent, register_link: e.target.value })
              }
            />
            <S.StyledInput
              type="text"
              placeholder="Fees"
              value={newEvent.fees}
              onChange={(e) =>
                setNewEvent({ ...newEvent, fees: e.target.value })
              }
            />
            <S.StyledInput
              type="text"
              placeholder="Schedule"
              value={newEvent.schedule}
              onChange={(e) =>
                setNewEvent({ ...newEvent, schedule: e.target.value })
              }
            />
            <S.StyledInput
              type="email"
              placeholder="Contact Email"
              value={newEvent.contact}
              onChange={(e) =>
                setNewEvent({ ...newEvent, contact: e.target.value })
              }
            />


            {/* Agenda Section */}
            <S.StyledInput type="text" placeholder="Agenda Time" value={newEvent.agenda.time}
              onChange={(e) => setNewEvent({ ...newEvent, agenda: { ...newEvent.agenda, time: e.target.value } })} />
            <S.StyledInput type="text" placeholder="Agenda Topic" value={newEvent.agenda.topic}
              onChange={(e) => setNewEvent({ ...newEvent, agenda: { ...newEvent.agenda, topic: e.target.value } })} />

            {/* 🔹 Speaker Section (Only One Speaker Allowed) */}
            <S.StyledLabel>Speaker</S.StyledLabel>
            <S.StyledInput
              type="text"
              placeholder="Speaker Name"
              value={newEvent.speaker.name}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  speaker: { ...newEvent.speaker, name: e.target.value },
                })
              }
            />
            <S.StyledTextArea
              placeholder="Speaker Bio"
              value={newEvent.speaker.bio}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  speaker: { ...newEvent.speaker, bio: e.target.value },
                })
              }
            />

            {/* Submit Button */}
            <S.StyledButton onClick={handleAddOrEditEvent}>
              {editingEvent ? "Update Event" : "Add Event"}
            </S.StyledButton>
          </S.EventFormContainer>
        )}

        {/* Events List with Edit/Delete */}
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : filteredEvents.length > 0 ? (
          <S.EventsGrid>
            {filteredEvents.map((event) => (
              <S.EventCard key={event.id}>
                <S.EventTitle>{event.title}</S.EventTitle>
                <S.EventDate>{event.date}</S.EventDate>
                <S.EventVenue>📍 {event.venue}</S.EventVenue>
                <S.EventDescription>
                  {event.description.substring(0, 100)}...
                </S.EventDescription>
                <S.EditButton onClick={() => handleEditEvent(event)}>
                  Edit
                </S.EditButton>
                <S.DeleteButton onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </S.DeleteButton>
              </S.EventCard>
            ))}
          </S.EventsGrid>
        ) : (
          <p>No events found</p>
        )}
      </S.EventsContainer>
    </ThemeProvider>
  );
}
