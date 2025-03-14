// components/club/ThemeToggle.jsx
import React from 'react';
import './styles.css';
const ThemeToggle = ({ darkMode, toggleTheme }) => {
  return (
    <>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </>
  );
};

export default ThemeToggle;
