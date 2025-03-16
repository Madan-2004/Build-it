import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import * as S from "./EventElements";

// Global Styles for Full Page Theme Support
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
  inputBackground: "#ffffff",
  buttonBackground: "#333333",
  buttonText: "#ffffff",
  filterBackground: "#ffffff",
  borderColor: "#ddd",
  categoryButton: "#007BFF",
  categoryButtonText: "#ffffff",
};

const darkTheme = {
  background: "#181818",
  text: "#ffffff",
  cardBackground: "#222222",
  inputBackground: "#2C2C2C",
  buttonBackground: "#ffffff",
  buttonText: "#002147",
  filterBackground: "#222222",
  borderColor: "#444",
  categoryButton: "#007BFF",
  categoryButtonText: "#ffffff",
  eventTitle: "#00A6FF",
  eventDescription: "#E0E0E0",
  eventVenue: "#CCCCCC",
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/events/");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched events:", data);
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleCategoryFilter = (category) => setSelectedCategory(category);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleTheme = () => setDarkMode((prevMode) => !prevMode);

  let filteredEvents = events
    .filter(
      (event) =>
        event.title?.toLowerCase().includes(searchTerm) &&
        (selectedCategory === "All" || event.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === "name")
        return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "date")
        return new Date(a.date || 0) - new Date(b.date || 0);
      if (sortBy === "venue")
        return (a.venue || "").localeCompare(b.venue || "");
      return 0;
    });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <S.EventsContainer>
        <S.HeroSection>
          <S.HeroContent>
            <S.HeroTitle>Upcoming Events</S.HeroTitle>
            <S.HeroSubtitle>
              Stay updated with the latest events happening near you
            </S.HeroSubtitle>
            <S.ThemeToggle onClick={toggleTheme}>
              {darkMode ? "🌞" : "🌙"}
            </S.ThemeToggle>
          </S.HeroContent>
        </S.HeroSection>

        {/* Search, Sort & Category Filters */}
        <S.FilterSection>
          <S.SearchContainer>
            <S.SearchInput
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <S.SortSelect value={sortBy} onChange={handleSortChange}>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="venue">Sort by Venue</option>
            </S.SortSelect>
          </S.SearchContainer>

          <S.CategoryFilter>
            {["All", "Technical", "Cultural", "Sports", "Workshops"].map(
              (category) => (
                <S.CategoryButton
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </S.CategoryButton>
              )
            )}
          </S.CategoryFilter>
        </S.FilterSection>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <S.EventsGrid>
            {filteredEvents.map((event, index) => (
              <S.EventCard key={index}>
                {event.poster && (
                  <S.EventImage src={event.poster} alt={event.title} />
                )}
                <S.EventDate>{event.date}</S.EventDate>
                <S.EventContent>
                  <S.EventTitle>{event.title}</S.EventTitle>
                  <S.EventVenue>📍 {event.venue}</S.EventVenue>
                  <S.EventDescription>
                    {event.description.substring(0, 100)}...
                  </S.EventDescription>
                  <S.EventFooter>
                    <S.EventCategory category={event.category}>
                      {event.category}
                    </S.EventCategory>
                    <S.RegisterButton
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Details
                    </S.RegisterButton>
                  </S.EventFooter>
                </S.EventContent>
              </S.EventCard>
            ))}
          </S.EventsGrid>
        ) : (
          <S.NoEventsMessage>No events found</S.NoEventsMessage>
        )}
      </S.EventsContainer>
    </ThemeProvider>
  );
}
