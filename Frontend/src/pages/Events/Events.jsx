import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./EventElements";
import eventsData from "./eventsData"; 

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEvents = eventsData.filter((event) =>
    event.title.toLowerCase().includes(searchTerm)
  );

  return (
    <S.EventsContainer>
      <S.HeroSection>
        <S.HeroContent>
          <S.HeroTitle>Upcoming Events</S.HeroTitle>
          <S.HeroSubtitle>Stay updated with the latest events happening near you</S.HeroSubtitle>
        </S.HeroContent>
      </S.HeroSection>

      <S.FilterSection>
        <S.SearchContainer>
          <S.SearchInput
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </S.SearchContainer>
      </S.FilterSection>

      {filteredEvents.length > 0 ? (
        <S.EventsGrid>
          {filteredEvents.map((event, index) => (
            <S.EventCard key={index}>
              {event.poster && <S.EventImage src={event.poster} alt={event.title} />}
              <S.EventDate>{event.date}</S.EventDate>
              <S.EventContent>
                <S.EventTitle>{event.title}</S.EventTitle>
                <S.EventVenue>📍 {event.venue}</S.EventVenue>
                <S.EventDescription>{event.description.substring(0, 100)}...</S.EventDescription>
                <S.EventFooter>
                  <S.EventCategory category={event.category}>{event.category}</S.EventCategory>
                  <S.RegisterButton onClick={() => navigate(`/events/${encodeURIComponent(event.title)}`)}>
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
  );
}
