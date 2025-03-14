import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Nav,
  NavLogo,
  LogoText,
  InstituteName,
  SubHeading,
  LogoImage,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavContainer
} from "./NavbarElements";
import Logo from "../../Images/general/logo.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Check if current route is homepage
  const isHomepage = location.pathname === "/";

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Nav scrolled={scrolled} isHomepage={isHomepage}>
      <NavContainer scrolled={scrolled || !isHomepage} isHomepage={isHomepage}>
        <NavLogo to="/">
          <LogoImage src={Logo} alt="Institute Logo" />
          <LogoText>
            <InstituteName>IIT Indore</InstituteName>
            <SubHeading scrolled={scrolled || !isHomepage}>Students' Gymkhana</SubHeading>
          </LogoText>
        </NavLogo>

        <Bars onClick={toggleMenu} aria-label="Open navigation menu" />

        <NavMenu isOpen={isOpen} scrolled={scrolled || !isHomepage} isHomepage={isHomepage}>
          <NavLink
            to="/"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            HOME
          </NavLink>
          <NavLink
            to="/about"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            ABOUT US
          </NavLink>
          <NavLink
            to="/council"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            COUNCIL
          </NavLink>
          <NavLink
            to="/events"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            EVENTS
          </NavLink>
          <NavLink
            to="/elections"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            ELECTIONS
          </NavLink>
          <NavLink
            to="/faqs"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            FAQ's
          </NavLink>
          <NavLink
            to="/profile"
            onClick={toggleMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive ? "#00a8e8" : (scrolled || !isHomepage) ? "#f7f7f7" : "#f7f7f7",
            })}
          >
            PROFILE
          </NavLink>

          <NavBtn>
            <NavBtnLink to="/contact" onClick={toggleMenu} scrolled={scrolled || !isHomepage}>
              Contact Us
            </NavBtnLink>
          </NavBtn>
        </NavMenu>
      </NavContainer>
    </Nav>
  );
}