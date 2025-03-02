// HomeElements.js
import styled from "styled-components";

export const CarouselContainer = styled.div`
  width: 100%;
  height: 100vh; // Changed from 80vh to 100vh
  max-height: none; // Removed max-height constraint
  overflow: hidden;
  position: relative;

  @media (max-aspect-ratio: 3/4) {
    object-fit: contain;
    background: #f0f0f0;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  height: 100vh; // Changed from 80vh to 100vh
  max-height: none; // Removed max-height constraint
`;

export const TextOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translate(-20%, -50%);
  color: #ffffff;
  // text-align: center;
  width: 80%;
  padding: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 rgba(0, 0, 0, 0.3); /* Multi-layer shadow */
  font-weight: 700;
  letter-spacing: 0.5px;

  font-size: 2rem;
  line-height: 1.3;

  .title {
    font-size: 1em;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 0.5em;
    opacity: 0.9;
    display: block;
  }

  @media (min-width: 768px) {
    font-size: 3rem;
    width: 70%;
  }

  @media (min-width: 1200px) {
    font-size: 3.5rem;
    width: 60%;
  }
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 100vh; // Changed from fixed height to 100vh
  object-fit: cover;
  object-position: center center;
  image-rendering: crisp-edges;
  
  /* Add an overlay for darker contrast */
  filter: brightness(0.7); // Makes the image darker

  @media (max-width: 768px) {
    height: 100vh; // Adjusted for mobile too
    image-rendering: -webkit-optimize-contrast;
  }
`;

export const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }
`;

export const DotContainer = styled.div`
  .slick-dots {
    bottom: 2rem;

    li button:before {
      color: white;
      font-size: 12px;
    }

    li.slick-active button:before {
      color: #ffd700;
    }
  }
`;

export const SkeletonLoader = styled.div`
  width: 100%;
  height: 80vh;
  background: #e0e0e0;
  animation: pulse 1.5s infinite;
  opacity: 1;
  transition: opacity 0.5s ease-out;

  &[aria-hidden="true"] {
    opacity: 0;
    pointer-events: none;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const MissionSection = styled.section`
  display: flex;
  gap: 4rem;
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    padding: 3rem 1rem;
  }
`;

export const MissionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const MissionHeading = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #e74c3c;
  }
`;

export const MissionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #34495e;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export const MissionImage = styled.img`
  flex: 0 0 45%;
  max-width: 500px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;
