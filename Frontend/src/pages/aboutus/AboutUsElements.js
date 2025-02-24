// AboutUsElements.js
import styled from 'styled-components';

export const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const HeroSection = styled.div`
  background: linear-gradient(135deg, #002147 0%, #003366 100%);
  color: white;
  padding: 6rem 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: #FFD700;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    opacity: 0.15;
  }

  &::after {
    content: '';
    position: absolute;
    top: -100px;
    left: -50px;
    width: 300px;
    height: 300px;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;
  }
`;

export const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  span {
    color: #FFD700;
    display: block;
    font-size: 1.2em;
    margin-top: 0.5rem;
  }
`;

export const HeroText = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding: 1.5rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #FFD700;
  }
`;


// Section Components
export const Section = styled.section`
  display: grid;
  grid-template-columns: ${props => props.reverse ? '1fr 1.2fr' : '1.2fr 1fr'};
  gap: 3rem;
  margin: 4rem 0;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
`;

export const SectionLeft = styled.div`
  padding: 1rem;
  order: ${props => props.reverse ? 2 : 1};
`;

export const SectionRight = styled.div`
  padding: 1rem;
  order: ${props => props.reverse ? 1 : 2};
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #002147;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #FFD700;
  }
`;

export const SectionText = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 1.5rem;
`;

export const SectionImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Value Components
export const ValueSection = styled.div`
  background: #f8f9fa;
  padding: 4rem 2rem;
  border-radius: 8px;
  margin: 4rem 0;
`;

export const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const ValueCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #002147;
    margin: 1rem 0;
    font-size: 1.3rem;
  }

  p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

// List Components
export const ValueList = styled.ul`
  list-style: none;
  padding-left: 1.5rem;
  margin: 1.5rem 0;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
    line-height: 1.6;
    color: #444;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #FFD700;
      font-size: 1.2rem;
      line-height: 1;
    }
  }
`;

export const ConstitutionLink = styled.a`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #002147;
  color: white !important;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
  border: 2px solid transparent;

  &:hover {
    background-color: #FFD700;
    color: #002147 !important;
    border-color: #002147;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const RightCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 33, 71, 0.1);
  transition: transform 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #002147;
    margin: 1rem 0;
    font-size: 1.25rem;
  }

  svg {
    color: #FFD700;
  }
`;

export const RightList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    font-size: 0.95rem;
    color: #444;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const ImportantNote = styled.div`
  background: #FFF9E6;
  padding: 1.5rem;
  border-left: 4px solid #FFD700;
  margin: 2rem 0;
  border-radius: 4px;
  color: #666;

  strong {
    color: #002147;
  }
`;

