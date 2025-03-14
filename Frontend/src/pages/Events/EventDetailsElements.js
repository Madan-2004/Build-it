import styled from "styled-components";


// Event Page Container
export const EventContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, color 0.3s ease;
`;

// Dark Mode Toggle Button (Updated as per your request)
export const DarkModeButton = styled.button`
  position: fixed;
  top: 6rem;
  right: 1rem;
  width: 45px;
  height: 45px;
  background: ${({ theme }) => theme.text};
  color: ${({ darkMode }) => (darkMode ? "#000" : "#fff")};
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover {
    background: rgba(77, 77, 77, 0.74);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Event Header
export const EventHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const EventTitle = styled.h1`
  font-size: 26px;
  color: ${({ theme }) => theme.text};
`;

export const EventDateVenue = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  font-weight: 400;
`;

// Event Image
export const EventImage = styled.img`
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 8px;
  margin: 20px 0;
`;

// Event Description
export const EventDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text};
`;

// Section Wrapper
export const Section = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 6px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

// Agenda List
export const AgendaList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const AgendaItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.text};

  &:last-child {
    border-bottom: none;
  }
`;

// Speaker List
export const SpeakerList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const SpeakerItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.text};

  &:last-child {
    border-bottom: none;
  }
`;

// Register & Back Buttons
export const RegisterButton = styled.a`
  display: block;
  text-align: center;
  padding: 12px;
  margin-top: 20px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const BackButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.buttonBackground};
    color: ${({ theme }) => theme.buttonText};
  }
`;
