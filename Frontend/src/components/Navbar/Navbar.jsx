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
  NavContainer,
  CloseIcon,
} from "./NavbarElements";
import Logo from "../../Images/general/logo.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if current route is homepage
  const isHomepage = location.pathname === "/";

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Nav scrolled={scrolled} isHomepage={isHomepage}>
      <NavContainer scrolled={scrolled || !isHomepage} isHomepage={isHomepage}>
        <NavLogo to="/">
          <LogoImage src={Logo} alt="Institute Logo" />
          <LogoText>
            <InstituteName>IIT Indore</InstituteName>
            <SubHeading scrolled={scrolled || !isHomepage}>
              Students' Gymkhana
            </SubHeading>
          </LogoText>
        </NavLogo>

        {isOpen ? (
          <CloseIcon onClick={toggleMenu} aria-label="Close navigation menu" />
        ) : (
          <Bars onClick={toggleMenu} aria-label="Open navigation menu" />
        )}

        <NavMenu
          isOpen={isOpen}
          scrolled={scrolled || !isHomepage}
          isHomepage={isHomepage}
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            HOME
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            ABOUT US
          </NavLink>
          <NavLink
            to="/council"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            COUNCIL
          </NavLink>
          <NavLink
            to="/events"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            EVENTS
          </NavLink>
          <NavLink
            to="/elections"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            ELECTIONS
          </NavLink>
          <NavLink
            to="/faqs"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            FAQ'S
          </NavLink>
          <NavLink
            to="/profile"
            onClick={closeMenu}
            scrolled={scrolled || !isHomepage}
            style={({ isActive }) => ({
              color: isActive
                ? "#00a8e8"
                : scrolled || !isHomepage
                  ? "#f7f7f7"
                  : "#f7f7f7",
            })}
          >
            PROFILE
          </NavLink>

          <NavBtn>
            <NavBtnLink
              to="/contact"
              onClick={closeMenu}
              scrolled={scrolled || !isHomepage}
            >
              Contact Us
            </NavBtnLink>
          </NavBtn>
        </NavMenu>
      </NavContainer>
    </Nav>
  );
}
