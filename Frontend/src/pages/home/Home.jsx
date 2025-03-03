import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import {
  CarouselContainer,
  TextOverlay,
  ImageWrapper,
  CarouselImage,
  ArrowButton,
  DotContainer,
  SkeletonLoader,
  MissionSection,
  MissionContent,
  MissionHeading,
  MissionText,
  MissionImage,
  CouncilSection,
  CouncilHeading,
  CouncilGrid,
  CouncilCard,
  CouncilTitle,
  CouncilDescription,
  CouncilIcon,
} from "./HomeElements";
import img1 from "../../images/home/img1.jpg";
import img2 from "../../images/home/img2.jpg";
import img3 from "../../images/home/img3.jpg";
import missionImage from "../../images/home/mission.jpg";

const slides = [
  {
    img: img1,
    title: "Students' Gymkhana, IIT Indore",
    subtitle: "Welcome to",
    alt: "Welcome to Students' Gymkhana IIT Indore",
  },
  {
    img: img2,
    title: "Students' Gymkhana IIT INDORE",
    subtitle: "Welcome to",
    alt: "Empowering Student Leadership",
  },
  {
    img: img3,
    title: "Students' Gymkhana IIT INDORE",
    subtitle: "Welcome to",
    alt: "Building a Better Campus Community",
  },
];
const councils = [
  {
    id: "science-technology",
    title: "Science and Technology Council",
    description: "The SnT Council of IIT Indore is a community of science and technology enthusiasts who love to explore the unthinkable.",
    icon: "🔬", // You can replace with actual icon component
    path: "/council/Science%20and%20Technology%20Council/clubs"
  },
  {
    id: "cultural",
    title: "Cultural Council",
    description: "The Cultural Council of IIT Indore orchestrates a diverse array of cultural events throughout the year, fostering artistic expression and community engagement among students and faculty alike.",
    icon: "🎭", // You can replace with actual icon component
    path: "/council/Cultural%20Council/clubs"
  },
  {
    id: "sports",
    title: "Sports Council",
    description: "The Sports Council is the voice and face of IIT Indore sports community, responsible for management and conduction of all sporting events in the campus.",
    icon: "🏆", // You can replace with actual icon component
    path: "/council/Cultural%20Council/clubs"
  },
  {
    id: "academic",
    title: "Academic Council",
    description: "The Academics Council has been trusted with the responsibility of managing executive activities in two of the most crucial aspects of student life - Academics and Career.",
    icon: "📚", // You can replace with actual icon component
    path: "/council/Academic%20Council/clubs"
  }
];

const PrevArrow = ({ onClick }) => (
  <ArrowButton className="prev" onClick={onClick} aria-label="Previous slide">
    {/* Add your icon here */}
    &lt;
  </ArrowButton>
);

const NextArrow = ({ onClick }) => (
  <ArrowButton className="next" onClick={onClick} aria-label="Next slide">
    {/* Add your icon here */}
    &gt;
  </ArrowButton>
);

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  fade: true, // Add fade effect
  pauseOnHover: false,
  ariaLabel: "Institute highlights carousel",
  // nextArrow: <NextArrow aria-label="Next slide" />,
  // prevArrow: <PrevArrow aria-label="Previous slide" />,
  appendDots: (dots) => <DotContainer>{dots}</DotContainer>,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: false,
      },
    },
  ],
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all(
          slides.map(
            (slide) =>
              new Promise((resolve, reject) => {
                const img = new window.Image();
                img.src = slide.img;
                img.onload = () => {
                  console.log(`Loaded: ${slide.img}`);
                  resolve();
                };
                img.onerror = (e) => {
                  console.error(`Failed to load: ${slide.img}`, e);
                  reject(e);
                };
              })
          )
        );
      } catch (error) {
        console.error("Image loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return <SkeletonLoader aria-live="polite" />;
  }

  return (
    <>
      <CarouselContainer>
        <Slider
          {...carouselSettings}
          beforeChange={(current, next) => setSlideIndex(next)}
        >
          {slides.map((slide, index) => (
            <ImageWrapper key={slide.alt}>
              <CarouselImage
                src={slide.img}
                alt={slide.alt}
                loading={index === 0 ? "eager" : "lazy"}
                aria-hidden={index !== slideIndex ? "true" : "false"}
              />
              <TextOverlay
                style={{
                  textShadow: `2px 2px 4px rgba(0,0,0,${
                    index === 0 ? 0.8 : 0.6
                  })`,
                }}
              >
                <span className="subtitle">{slide.subtitle}</span>
                <span className="title">{slide.title}</span>
              </TextOverlay>
            </ImageWrapper>
          ))}
        </Slider>
      </CarouselContainer>

      <MissionSection>
        <MissionContent>
          <MissionHeading>MISSION</MissionHeading>
          <MissionText>
            The mission of the Student Gymkhana of IIT Indore is to represent,
            support and empower the student body. We foster meaningful
            interactions among students, faculty, and the administration.
          </MissionText>
          <MissionText>
            We have modeled a democratic structure and are ever striving towards
            a more perfect union on campus. We are here to improve the
            approachability of institute structures through responsible and
            principled student representation.
          </MissionText>
          <MissionText>
            The Student Gymkhana represents all the students and scholars of IIT
            Indore. We are here to serve the students of IIT Indore. This
            website contains information with regard to all organs of the
            student gymkhana system. Do contact us (feedback form), for any
            queries.
          </MissionText>
        </MissionContent>
        <MissionImage
          src={missionImage}
          alt="Student community at IIT Indore"
        />
      </MissionSection>
      <CouncilSection>
        <CouncilHeading>OUR COUNCILS</CouncilHeading>
        <CouncilGrid>
          {councils.map((council) => (
            <Link to={council.path} key={council.id} style={{ textDecoration: 'none' }}>
              <CouncilCard>
                <CouncilIcon>{council.icon}</CouncilIcon>
                <CouncilTitle>{council.title}</CouncilTitle>
                <CouncilDescription>{council.description}</CouncilDescription>
              </CouncilCard>
            </Link>
          ))}
        </CouncilGrid>
      </CouncilSection>
    </>
  );
}
