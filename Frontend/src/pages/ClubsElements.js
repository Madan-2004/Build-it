import styled from "styled-components";

export const ClubsSection = styled.section`
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

export const SectionHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1a237e;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: #ff5722;
  }
`;

export const ClubsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

export const ClubCard = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
  }
`;

export const ClubImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const ClubContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ClubTagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const ClubTag = styled.span`
  background-color: #e3f2fd;
  color: #1565c0;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`;

export const ClubName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a237e;
`;

export const ClubDescription = styled.p`
  font-size: 0.95rem;
  color: #455a64;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

export const ClubMemberCount = styled.span`
  display: inline-block;
  color: #546e7a;
  font-size: 0.85rem;
  font-weight: 500;
`;

export const ClubHeadInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ClubHeadAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ClubHeadName = styled.span`
  font-size: 0.85rem;
  color: #546e7a;
`;

export const ClubViewButton = styled.button`
  width: 100%;
  background-color: #1a237e;
  color: white;
  font-weight: 600;
  padding: 0.75rem 0;
  border-radius: 6px;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  text-align: center;
  
  &:hover {
    background-color: #0e1859;
  }
`;