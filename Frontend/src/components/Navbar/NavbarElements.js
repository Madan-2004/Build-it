import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

export const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 12;
  padding: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "0";
    return scrolled ? "0" : "25px 0";
  }};
  transition: all 0.3s ease-in-out;

  /* Added smoother transitions for mid-sized screens */
  @media screen and (max-width: 992px) {
    padding: ${({ scrolled, isHomepage }) => {
      if (!isHomepage) return "0";
      return scrolled ? "0" : "20px 0";
    }};
  }

  @media screen and (max-width: 480px) {
    padding: ${({ scrolled, isHomepage }) => {
      if (!isHomepage) return "0";
      return scrolled ? "0" : "15px 0";
    }};
  }
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "100%";
    return scrolled ? "100%" : "90%";
  }};
  height: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "90px";
    return scrolled ? "90px" : "100px";
  }};
  max-width: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "none";
    return scrolled ? "none" : "1400px";
  }};
  margin: 0 auto;
  padding: 0
    ${({ scrolled, isHomepage }) => {
      if (!isHomepage) return "50px";
      return scrolled ? "50px" : "30px";
    }};
  background: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "#00171f";
    return scrolled ? "#00171f" : "rgba(0, 23, 31, 0.4)";
  }};
  backdrop-filter: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "none";
    return scrolled ? "none" : "blur(15px)";
  }};
  border-radius: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "0";
    return scrolled ? "0" : "16px";
  }};
  box-shadow: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "0px 4px 10px rgba(0, 0, 0, 0.3)";
    return scrolled
      ? "0px 4px 10px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.15)";
  }};
  border: ${({ scrolled, isHomepage }) => {
    if (!isHomepage) return "none";
    return scrolled ? "none" : "1px solid rgba(255, 255, 255, 0.18)";
  }};
  transition: all 0.3s ease-in-out;

  /* Added intermediate breakpoint for smoother transitions */
  @media screen and (max-width: 992px) {
    padding: 0 30px;
    height: ${({ scrolled, isHomepage }) => {
      if (!isHomepage) return "80px";
      return scrolled ? "80px" : "90px";
    }};
  }

  @media screen and (max-width: 768px) {
    padding: 0 20px;
    height: ${({ scrolled, isHomepage }) => {
      if (!isHomepage) return "70px";
      return scrolled ? "70px" : "80px";
    }};
  }

  @media screen and (max-width: 480px) {
    padding: 0 15px;
    height: ${({ scrolled, isHomepage }) => {
      if (!isHomepage) return "60px";
      return scrolled ? "60px" : "70px";
    }};
    width: 100%;
  }
`;

export const NavLogo = styled(Link)`
  cursor: pointer;
  color: #00a8e8;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
  margin-right: 20px;

  &:hover {
    color: #007ea7;
  }

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) {
    gap: 0.8rem;
  }

  @media screen and (max-width: 768px) {
    position: relative;
    left: 0;
    gap: 0.5rem;
  }
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) {
    line-height: 1.15;
  }

  @media screen and (max-width: 480px) {
    line-height: 1.1;
  }
`;

export const InstituteName = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: #f7f7f7;
  letter-spacing: 0.5px;

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) {
    font-size: 1.4rem;
  }

  @media screen and (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media screen and (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const SubHeading = styled.span`
  font-size: 1rem;
  color: ${({ scrolled }) => (scrolled ? "#8d99ae" : "#f7f7f7")};
  transition: color 0.3s ease;

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) {
    font-size: 0.95rem;
  }

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media screen and (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const LogoImage = styled.img`
  height: 65px;
  width: auto;
  border-radius: 50%;

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) {
    height: 55px;
  }

  @media screen and (max-width: 768px) {
    height: 50px;
  }

  @media screen and (max-width: 480px) {
    height: 40px;
  }
`;

export const NavLink = styled(Link)`
  color: ${({ scrolled }) => (scrolled ? "#8d99ae" : "#f7f7f7")};
  padding: 0 1.2rem;
  font-weight: 500;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;

  &:hover {
    color: #00a8e8;
    &::after {
      width: 100%;
    }
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 0;
    height: 2px;
    background: #00a8e8;
    transition: width 0.3s ease;
  }

  &.active {
    color: #00a8e8;
    &::after {
      width: 100%;
    }
  }

  /* Added intermediate breakpoint with improved spacing */
  @media screen and (max-width: 992px) {
    padding: 0 0.8rem;
    font-size: 1rem;
  }

  /* Modified mobile menu behavior to start at a more appropriate breakpoint */
  @media screen and (max-width: 768px) {
    padding: 1.5rem 0;
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
  }

  @media screen and (max-width: 480px) {
    padding: 1.2rem 0;
    font-size: 1.1rem;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #00a8e8;
  @media screen and (max-width: 768px) {
    display: block;
    font-size: 1.8rem;
    cursor: pointer;
  }

  @media screen and (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const CloseIcon = styled(IoMdClose)`
  display: none;
  color: #00a8e8;

  @media screen and (max-width: 768px) {
    display: block;
    font-size: 2rem;
    cursor: pointer;
    z-index: 20;
  }

  @media screen and (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  /* Added adjustments for immediate pre-mobile resolutions */
  @media screen and (max-width: 992px) and (min-width: 769px) {
    gap: 0.2rem; /* Reduce spacing between nav items */
  }

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: #00171f;
    padding: 6rem 2rem 2rem;
    transition: all 0.3s ease;
    z-index: 10;
    overflow-y: auto;
    justify-content: flex-start;
  }

  @media screen and (max-width: 480px) {
    padding: 5rem 1.5rem 1.5rem;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) and (min-width: 769px) {
    margin-left: 1rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 2rem 0 0;
    justify-content: center;
  }

  @media screen and (max-width: 480px) {
    margin: 1.5rem 0 0;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 6px;
  background: ${({ scrolled }) =>
    scrolled ? "transparent" : "rgba(0, 168, 232, 0.15)"};
  padding: 12px 24px;
  color: #00a8e8;
  font-weight: 500;
  font-size: 1.05rem;
  outline: none;
  border: 2px solid #00a8e8;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #007ea7;
    color: #f7f7f7;
    border-color: #007ea7;
    transform: translateY(-2px);
  }

  /* Added intermediate breakpoint */
  @media screen and (max-width: 992px) and (min-width: 769px) {
    padding: 10px 18px;
    font-size: 1rem;
  }

  @media screen and (max-width: 768px) {
    width: 80%;
    text-align: center;
    padding: 14px 0;
    font-size: 1.1rem;
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    padding: 12px 0;
    font-size: 1rem;
  }
`;