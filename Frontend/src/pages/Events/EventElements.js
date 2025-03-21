// EventsElements.js
import styled from 'styled-components';

export const EventsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
`;

export const HeroSection = styled.div`
  background: linear-gradient(135deg, #002147 0%, #003366 100%);
  color: white;
  padding: 6rem 1rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 0 0 30px 30px;
`;

export const ThemeToggle = styled.button`
  position: fixed;
  top: 6rem;
  right: 1rem;
  width: 45px;
  height: 45px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
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
    background:rgba(77, 77, 77, 0.74);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;


export const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

export const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

export const FilterSection = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.filterBackground};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  gap: 1rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
  }
`;

export const SortSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;


export const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const CategoryButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ active, theme }) => (active ? theme.categoryButton : theme.filterBackground)};
  color: ${({ active, theme }) => (active ? theme.categoryButtonText : theme.text)};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme }) => theme.categoryButton};
    color: ${({ theme }) => theme.categoryButtonText};
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const EventCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const EventTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.eventTitle}; // Brighter Blue in Dark Mode
`;

export const EventVenue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.eventVenue}; // Soft Gray for Venue Text
  margin-bottom: 1rem;
`;

export const EventDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.eventDescription}; // Light Gray for Descriptions
  margin-bottom: 1.5rem;
`;

export const EventFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RegisterButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  border: none;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }
`;


export const EventDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.filterBackground};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

export const EventCategory = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #181818;
  background: ${({ category, theme }) => {
    if (theme.background === "#121212") {
      switch (category.toLowerCase()) {
        case "technical":
          return "#1e88e5"; // Dark Blue
        case "cultural":
          return "#8e24aa"; // Dark Purple
        case "sports":
          return "#43a047"; // Dark Green
        case "workshops":
          return "#ff7043"; // Dark Orange
        default:
          return "#757575"; // Dark Gray
      }
    } else {
      switch (category.toLowerCase()) {
        case "technical":
          return "#e3f2fd";
        case "cultural":
          return "#f3e5f5";
        case "sports":
          return "#f0f4c3";
        case "workshops":
          return "#ffccbc";
        default:
          return "#e0e0e0";
      }
    }
  }};
`;

export const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const EventContent = styled.div`
  padding: 1.5rem;
`;


export const NoEventsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
`;

export const AdminButton = styled.button`
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: 0.3s;
  
  &:hover {
    background-color: #0056b3;
  }
`;
