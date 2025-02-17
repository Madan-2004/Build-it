import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  background: #00171f; 
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #003459; 
`;

export const NavLogo = styled(Link)`
  cursor: pointer;
  color: #00a8e8; 
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #007ea7;
  }
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

export const InstituteName = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #f7f7f7;
`;

export const SubHeading = styled.span`
  font-size: 0.9rem;
  color: #8d99ae; 
`;

export const LogoImage = styled.img`
  height: 60px;
  width: auto;
  border-radius: 50%;
`;

export const NavLink = styled(Link)`
  color: #8d99ae; 
  padding: 0 1.2rem;
  font-weight: 500;
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
`;

export const NavContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #00a8e8; 
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 85px;
    left: 0;
    background: #00171f 
    padding: 2rem;
    transition: all 0.3s ease;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-left: auto;
  position: absolute;
  right: 20px;
  @media (max-width: 768px) {
    width: 100%;
    margin: 2rem 0 0;
    justify-content: center;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: transparent;
  padding: 10px 22px;
  color: #00a8e8; 
  outline: none;
  border: 2px solid #00a8e8; 
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #007ea7; 
    color: #f7f7f7; 
    border-color: #007ea7; 
  }
`;
