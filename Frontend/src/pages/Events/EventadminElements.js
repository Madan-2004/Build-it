import styled from 'styled-components';

// 🔹 Main Page Container
export const EventsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
`;

// 🔹 Hero Section (Header)
export const HeroSection = styled.div`
  background: linear-gradient(135deg, #002147 0%, #003366 100%);
  color: white;
  padding: 6rem 1rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 0 0 30px 30px;
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

// 🔹 Dark Mode Toggle Button
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
    background: rgba(77, 77, 77, 0.74);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 🔹 Search & Filter Section
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

// 🔹 Events Grid Layout
export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

// 🔹 Event Card
export const EventCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  padding: 1.5rem;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const EventTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.eventTitle};
`;

export const EventDate = styled.p`
  font-size: 14px;
  color: #555;
`;

export const EventVenue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.eventVenue};
  margin-bottom: 1rem;
`;

export const EventDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.eventDescription};
  margin-bottom: 1.5rem;
`;



// 🔹 Admin Controls (Edit & Delete)

export const AddButton = styled.button`
  background-color: #28a745; /* Green color */
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #218838; /* Darker green */
  }
`;

export const EditButton = styled.button`
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.text};
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.text};
  }
`;

export const DeleteButton = styled.button`
  background: #d9534f;
  color: #fff;
  border: 1px solid #d9534f;
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c9302c;
    border-color: #c9302c;
  }
`;


//🔹Form Container(Admin Panel) 

export const EventFormContainer = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  }
`;


// 🔹 Label for Sections
export const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-top: 1rem;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => (theme.background === "#121212" ? "#00A6FF" : "#007BFF")};
    box-shadow: 0 0 5px rgba(0, 166, 255, 0.3);
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => (theme.background === "#121212" ? "#00A6FF" : "#007BFF")};
    box-shadow: 0 0 5px rgba(0, 166, 255, 0.3);
  }
`;
export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  appearance: none; /* Removes default dropdown arrow (optional) */

  &:focus {
    outline: none;
    border-color: ${({ theme }) =>
      theme.background === "#121212" ? "#00A6FF" : "#007BFF"};
    box-shadow: 0 0 5px rgba(0, 166, 255, 0.3);
  }
`;



// 🔹 Submit Button (Light & Dark Mode)
export const StyledButton = styled.button`
  background: ${({ theme }) => (theme.background === "#121212" ? "#00A6FF" : "#007BFF")};
  color: white;
  border: none;
  padding: 10px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${({ theme }) => (theme.background === "#121212" ? "#007BFF" : "#0056b3")};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 🔹 Wrapper for Agenda & Speakers
export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.inputBackground};
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.borderColor};
`;

// 🔹 Agenda & Speaker Item
export const ItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

// 🔹 No Events Message
export const NoEventsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
`;
