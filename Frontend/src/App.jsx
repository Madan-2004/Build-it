  import React, { useState, useEffect } from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate ,useLocation} from 'react-router-dom';
  import LoginPage from './pages/LoginPage';
  import CallbackPage from './pages/CallbackPage';
  import Dashboard from './pages/Dashboard1';
  import { authService } from './services/auth';
  import AuthSuccess from './pages/AuthSuccess';
  import Navbar from "./components/Navbar/Navbar";
  import Footer from "./components/Footer/Footer";
  import Home from './pages/home/Home';
  import About from './pages/aboutus/AboutUs';
  import Events from './pages/Events/Events';
  import EventDetails from './pages/Events/EventDetails';
  import Contact from './pages/contact';
  import Council from './pages/Council';
  import CouncilDetails from './pages/CouncilDetails';
  import ClubProfile from './pages/ClubProfile';
  import Profile from './pages/Profile';
  import './Styles/index.css';
  import ProtectedRoute from './components/ProtectedRoute';
  import styled from "styled-components";

  // Protected route component
  const PageWrapper = styled.div`
    padding-top: ${({ isHomepage }) => (isHomepage ? "0" : "120px")};
   
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
            <Route path="/council" element={<Council />} />
            <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
            <Route path="/clubs/:clubName" element={<ClubProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
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