import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import * as S from "./EventDetailsElements";

// Global Styles for Theming
const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background 0.3s ease, color 0.3s ease;
  }
`;

const lightTheme = {
  background: "#f5f5f5",
  text: "#002147",
  cardBackground: "#ffffff",
  buttonBackground: "#333333",
  buttonText: "#ffffff",
  borderColor: "#ddd",
};

const darkTheme = {
  background: "#181818",
  text: "#ffffff",
  cardBackground: "#222222",
  buttonBackground: "#e8e8e8",
  buttonText: "#002147",
  borderColor: "#444",
};

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/events/${eventId}/`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched event details:", data);
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!event) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <S.EventContainer>
          <h2>Event not found!</h2>
        </S.EventContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <S.EventContainer>
        <S.DarkModeButton onClick={toggleDarkMode}>
          {darkMode ? "☀️" : "🌙"}
        </S.DarkModeButton>

        <S.EventHeader>
          <S.EventTitle>{event.title}</S.EventTitle>
          <S.EventDateVenue>{event.date} | 📍 {event.venue}</S.EventDateVenue>
        </S.EventHeader>

        {event.poster && <S.EventImage src={event.poster} alt={event.title} />}
        <S.EventDescription>{event.description}</S.EventDescription>

        {/* 🔹 Single Agenda Section */}
        {event.agenda && event.agenda.time && (
          <S.Section>
            <S.SectionTitle>Agenda</S.SectionTitle>
            <S.AgendaItem>
              <span>{event.agenda.time} - {event.agenda.topic}</span>
            </S.AgendaItem>
          </S.Section>
        )}

        {/* 🔹 Single Speaker Section */}
        {event.speaker && event.speaker.name && (
          <S.Section>
            <S.SectionTitle>Speaker</S.SectionTitle>
            <S.SpeakerItem>
              <strong>{event.speaker.name}</strong> - {event.speaker.bio}
            </S.SpeakerItem>
          </S.Section>
        )}

        {/* 🔹 Additional Information */}
        <S.Section>
          <S.SectionTitle>Additional Information</S.SectionTitle>
          <p><strong>Schedule:</strong> {event.schedule || "N/A"}</p>
          <p><strong>Fees:</strong> {event.fees || "Free"}</p>
          <p><strong>Contact:</strong> {event.contact || "Not Available"}</p>
        </S.Section>

        <S.RegisterButton href={event.register_link}>Register Now</S.RegisterButton>
        <S.BackButton onClick={() => navigate("/events")}>Back to Events</S.BackButton>
      </S.EventContainer>
    </ThemeProvider>
  );
}
