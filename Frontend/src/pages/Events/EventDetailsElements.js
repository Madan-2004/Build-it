import styled from "styled-components";

export const EventContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

export const EventHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const EventTitle = styled.h1`
  font-size: 2.5rem;
  color: #002147;
`;

export const EventDateVenue = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

export const EventImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

export const EventDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 1.5rem;
`;

export const Section = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #003366;
`;

export const AgendaList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const AgendaItem = styled.li`
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
`;

export const SpeakerList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const SpeakerItem = styled.li`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #002147;
`;

export const RegisterButton = styled.a`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  border-radius: 5px;
  background: #002147;
  color: white;
  text-decoration: none;
  text-align: center;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #003366;
  }
`;

export const BackButton = styled.button`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  border-radius: 5px;
  background: #ddd;
  color: #333;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ccc;
  }
`;
