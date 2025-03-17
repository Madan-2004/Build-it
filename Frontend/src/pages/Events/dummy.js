import styled from "styled-components";

// Main Container
export const EventsContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

// Hero Section (Title & Theme Toggle)
export const HeroSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.cardBackground};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const HeroTitle = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.text};
`;

export const ThemeToggle = styled.button`
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.cardBackground};
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
`;

// Filter Section (Search, Sort, and Categories)
export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

export const SearchInput = styled.input`
  width: 60%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  font-size: 16px;
`;

export const CategoryFilter = styled.div`
  display: flex;
  gap: 10px;
`;

export const CategoryButton = styled.button`
  background: ${({ active, theme }) => (active ? theme.categoryButton : "#ddd")};
  color: ${({ active, theme }) => (active ? theme.categoryButtonText : "#000")};
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
`;

// Events Grid
export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

// Individual Event Card
export const EventCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const EventTitle = styled.h3`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

export const EventDate = styled.p`
  font-size: 14px;
  color: #555;
`;

export const EventVenue = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #007BFF;
`;

export const EventDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.eventDescription || "#666"};
`;

// Buttons for Events
export const RegisterButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  margin-top: 10px;
`;

export const DeleteButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  margin-left: 10px;
`;

// Admin Form Styling
export const EventForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  font-size: 16px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  font-size: 16px;
  height: 100px;
`;

export const SubmitButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
`;

export const EditButton = styled.button`
  background: #ffcc00;
  color: black;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  margin-left: 10px;
`;

export const NoEventsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #777;
`;
