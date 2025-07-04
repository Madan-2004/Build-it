﻿import React, { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// ✅ Authentication
import LoginPage from './pages/Auth/LoginPage';
import CallbackPage from './pages/Auth/CallbackPage';
import AuthSuccess from './pages/Auth/AuthSuccess';

// ✅ Dashboard
import Dashboard from './pages/Dashboard/Dashboard1';

// ✅ General Pages
import Home from './pages/home/Home';
import About from './pages/aboutus/AboutUs';
import Contact from './pages/Contact/Contact';
import FeedbackForm from './pages/Feedback/FeedbackForm';

// ✅ Events
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetails';
import Eventsadmin from './pages/Events/Eventadmin';

// ✅ Councils & Clubs
import Council from './pages/Council/Council';
import CouncilDetails from './pages/Council/CouncilDetails';
import ClubProfile from './pages/Clubs/ClubProfile';

// ✅ Elections - Voting
// import ElectionPage from './pages/elections/voting/ElectionPage';
import ElectionPage from './pages/elections/voting/ElectionPage';
import VotePage from './pages/elections/voting/VotePage';
import ElectionResultPage from './pages/elections/voting/ElectionResultPage';
import DetailedResultsView from './pages/elections/voting/DetailedResultsView';
import VotingConfirmationPage from './pages/elections/voting/VotingConfirmationPage';

// ✅ Elections - Admin
import AdminDashboard from './pages/elections/admin/AdminDashboard';
import AdminElectionsList from './pages/elections/admin/AdminElectionsList';
import CreateElectionForm from './pages/elections/admin/CreateElectionForm';
import EditElectionForm from './pages/elections/admin/EditElectionForm';
import AdminPositionList from './pages/elections/admin/AdminPositionList';
import AddPositionForm from './pages/elections/admin/AddPositionForm';
import CandidateForm from './pages/elections/admin/CandidateForm';
import CandidateList from './pages/elections/admin/CandidateList';

// Inventory pages
import ProjectInventory from './pages/Clubs/ProjectInventory';

// ✅ Utilities & Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RouteProtection from './pages/elections/utils/RouteProtection';
import EligibilityCheck from './pages/elections/utils/EligibilityCheck';

import './styles/index.css';
import styled from 'styled-components';
import axios from "axios";
import FAQPage from './pages/FAQS/FAQPage';
import ScrollToTop from './components/ScrollToTop';
import EventInventory from './pages/Clubs/EventInventory';

// Add this to your main app file (e.g., index.js or App.js)
axios.defaults.withCredentials = true;

// ✅ Conditional Wrapper for Page Layout
const PageWrapper = styled.div`
  padding-top: ${({ isHomepage }) => (isHomepage ? "0" : "90px")};
`;

function App() {
  useEffect(() => {
    // 🔹 Function to refresh token
    const refreshToken = async () => {
      try {
        await axios.post("http://localhost:8000/api/auth/token/refresh/", {}, { withCredentials: true });
        console.log("Access token refreshed successfully.");
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    };

    // 🔹 Refresh token every 1 hour (3600 * 1000 ms)
    const interval = setInterval(refreshToken, 60 * 60 * 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Router>
      <Navbar />
      <ConditionalWrapper>
        <ScrollToTop /> 
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/events-admin" element={<Eventsadmin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/council" element={<Council />} />
          <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
          <Route path="/clubs/:clubName" element={<ClubProfile />} />

          {/* ✅ Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* ✅ Elections - Voting */}
          <Route 
            path="/elections" 
            element={
              <ProtectedRoute>
                <ElectionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vote/:electionId" 
            element={
              <ProtectedRoute>
                <VotePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/elections/:electionId/results" 
            element={
              <ProtectedRoute>
                <ElectionResultPage />
              </ProtectedRoute>
            } 
          />
         <Route 
            path="/elections/:electionId/detailed-results" 
            element={
              <ProtectedRoute>
                <DetailedResultsView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vote-confirmation" 
            element={
              <ProtectedRoute>
                <VotingConfirmationPage />
              </ProtectedRoute>
            } 
          />
          {/* ✅ Admin Election Management (Protected) */}
          <Route 
            path="/admin/elections" 
            element={
              <ProtectedRoute role="admin">
                <AdminElectionsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections/create" 
            element={
              <ProtectedRoute role="admin">
                <CreateElectionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections/:electionId/edit" 
            element={
              <ProtectedRoute role="admin">
                <EditElectionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections/:electionId/positions" 
            element={
              <ProtectedRoute role="admin">
                <AdminPositionList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections/:electionId/positions/add" 
            element={
              <ProtectedRoute role="admin">
                <AddPositionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections/:electionId/positions/:positionId/candidates" 
            element={
              <ProtectedRoute role="admin">
                <CandidateList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections/:electionId/positions/:positionId/candidates/add" 
            element={
              <ProtectedRoute role="admin">
                <CandidateForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* ✅ Dashboard (Protected) */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* ✅ Redirect Logic */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Inventory routes */}
          <Route path='inventory/projects/:projectId' element={<ProjectInventory />} />
          <Route path='inventory/events/:eventId' element={<EventInventory />} />
        </Routes>
      </ConditionalWrapper>
      <ToastContainer position="top-right" autoClose={5000} />
      <Footer />
    </Router>
  );
}

// ✅ Wrapper Component for Homepage Layout Adjustments
const ConditionalWrapper = ({ children }) => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return <PageWrapper isHomepage={isHomepage}>{children}</PageWrapper>;
};

export default App;
