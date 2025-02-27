import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as S from "./EventDetailsElements";
import eventsData from "./eventsData";

export default function EventDetails() {
  const { eventTitle } = useParams();
  const navigate = useNavigate();

  const event = eventsData.find((e) => e.title === decodeURIComponent(eventTitle));

  if (!event) {
    return <S.EventContainer><h2>Event not found!</h2></S.EventContainer>;
  }

  return (
    <S.EventContainer>
      <S.EventHeader>
        <S.EventTitle>{event.title}</S.EventTitle>
        <S.EventDateVenue>{event.date} | 📍 {event.venue}</S.EventDateVenue>
      </S.EventHeader>

      <S.EventImage src={event.poster} alt={event.title} />
      <S.EventDescription>{event.description}</S.EventDescription>

      <S.Section>
        <S.SectionTitle>Agenda</S.SectionTitle>
        <S.AgendaList>
          {event.agenda.map((item, index) => (
            <S.AgendaItem key={index}>
              <span>{item.time} - {item.topic}</span>
              {item.speaker && <span>🎤 {item.speaker}</span>}
            </S.AgendaItem>
          ))}
        </S.AgendaList>
      </S.Section>

      {event.speakers.length > 0 && (
        <S.Section>
          <S.SectionTitle>Speakers</S.SectionTitle>
          <S.SpeakerList>
            {event.speakers.map((speaker, index) => (
              <S.SpeakerItem key={index}>{speaker.name} - {speaker.bio}</S.SpeakerItem>
            ))}
          </S.SpeakerList>
        </S.Section>
      )}

      <S.Section>
        <S.SectionTitle>Additional Information</S.SectionTitle>
        <p><strong>Schedule:</strong> {event.schedule}</p>
        <p><strong>Fees:</strong> {event.fees}</p>
        <p><strong>Contact:</strong> {event.contact}</p>
      </S.Section>

      <S.RegisterButton href={event.registerLink}>Register Now</S.RegisterButton>
      <S.BackButton onClick={() => navigate("/events")}>Back to Events</S.BackButton>
    </S.EventContainer>
  );
}
