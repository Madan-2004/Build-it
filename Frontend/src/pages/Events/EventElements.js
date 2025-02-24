// EventsElements.js
import styled from 'styled-components';

export const EventsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const HeroSection = styled.div`
  background: linear-gradient(135deg, #002147 0%, #003366 100%);
  color: white;
  padding: 6rem 1rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 0 0 30px 30px;
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
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  margin-left: 0.5rem;

  &:focus {
    outline: none;
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
  border: 1px solid #ddd;
  background: ${props => props.active ? '#002147' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const EventDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  color: #666;
  font-size: 0.9rem;
`;

export const EventContent = styled.div`
  padding: 1.5rem;
`;

export const EventTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #002147;
`;

export const EventVenue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

export const EventDescription = styled.p`
  color: #444;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const EventFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EventCategory = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  background: ${props => {
    switch(props.category.toLowerCase()) {
      case 'technical': return '#e3f2fd';
      case 'cultural': return '#f3e5f5';
      case 'sports': return '#f0f4c3';
      case 'workshops': return '#ffccbc';
      default: return '#e0e0e0';
    }
  }};
  color: #333;
`;

export const RegisterButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  border: none;
  background: #002147;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #003366;
    transform: translateY(-2px);
  }
`;

export const NoEventsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
`;
