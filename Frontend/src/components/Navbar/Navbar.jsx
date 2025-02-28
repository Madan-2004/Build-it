// Updated Navbar.jsx
import React, { useState } from "react";
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
} from "./NavbarElements";
import Logo from "../../Images/general/logo.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Nav>
      <NavLogo to="/">
        <LogoImage src={Logo} alt="Institute Logo" />
        <LogoText>
          <InstituteName>IIT Indore</InstituteName>
          <SubHeading>Students' Gymkhana</SubHeading>
        </LogoText>
      </NavLogo>

      <Bars onClick={toggleMenu} aria-label="Open navigation menu" />

      <NavMenu isOpen={isOpen}>
        <NavLink
          to="/"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          HOME
        </NavLink>
        <NavLink
          to="/about"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          ABOUT US
        </NavLink>
        <NavLink
          to="/council"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          COUNCIL
        </NavLink>
        <NavLink
          to="/events"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          EVENTS
        </NavLink>
        <NavLink
          to="/elections"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          ELECTIONS
        </NavLink>
        <NavLink
          to="/feedback"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          FEEDBACK
        </NavLink>
        <NavLink
          to="/profile"
          onClick={toggleMenu}
          style={({ isActive }) => ({
            color: isActive ? "#f7f7f7" : "#007ea7",
          })}
        >
          PROFILE
        </NavLink>

        <NavBtn>
          <NavBtnLink to="/contact" onClick={toggleMenu}>
            Contact Us
          </NavBtnLink>
        </NavBtn>
      </NavMenu>
    </Nav>
  );
}
