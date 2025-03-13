import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Authentication-related imports
import LoginPage from './pages/Auth/LoginPage';
import CallbackPage from './pages/Auth/CallbackPage';
import AuthSuccess from './pages/Auth/AuthSuccess';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard1';

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from './components/ProtectedRoute';

// Home & General Pages
import Home from './pages/home/Home';
import About from './pages/aboutus/AboutUs';
import Contact from './pages/contact/Contact';

// Events Pages
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetails';

// Council Pages
import Council from './pages/Council/Council';
import CouncilDetails from './pages/Council/CouncilDetails';

// Clubs Pages
import ClubProfile from './pages/Clubs/ClubProfile';



// Styles & Utilities
import './styles/index.css';
import styled from "styled-components";
import FeedbackForm from './pages/Feedback/FeedbackForm';
import ElectionPage from './pages/elections/ElectionPage';
import VotingPage from './pages/elections/votingpage';


  // Protected route component
  const PageWrapper = styled.div`
    padding-top: ${({ isHomepage }) => (isHomepage ? "0" : "90px")};
   
  `;

  function App() {
  
    
    return (
      <Router>
        <Navbar />
        <ConditionalWrapper>
        <Routes>
        <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventTitle" element={<EventDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/council" element={<Council />} />
            <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
            <Route path="/clubs/:clubName" element={<ClubProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route exact path="/elections" element={<ElectionPage/>} />

         
          <Route path="/vote/:electionId" element={<VotingPage/>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect to dashboard if logged in, otherwise to login */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          {/* Catch all other routes and redirect to dashboard or login */}
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" replace />} 
          />
          {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
        </Routes>
        </ConditionalWrapper>
        <Footer />
      </Router>
    );
  }
  // Component to conditionally wrap pages
const ConditionalWrapper = ({ children }) => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return <PageWrapper isHomepage={isHomepage}>{children}</PageWrapper>;
};


  export default App;