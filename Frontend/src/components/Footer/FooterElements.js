import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background: #2d3436;
  color: #ffffff;
  padding: 3rem 1rem;
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const FooterSection = styled.div`
  h3 {
    color: #dfe6e9;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    border-bottom: 2px solid #0984e3;
    padding-bottom: 0.5rem;
  }
`;

export const FooterLink = styled.a`
  color: #b2bec3;
  text-decoration: none;
  display: block;
  margin: 0.5rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: #74b9ff;
  }
`;

export const SocialContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  a {
    color: #dfe6e9;
    transition: color 0.3s ease;
    
    &:hover {
      color: #74b9ff;
    }
  }
`;

export const Copyright = styled.div`
  text-align: center;
  padding: 2rem 0 0;
  margin-top: 2rem;
  border-top: 1px solid #636e72;
`;