import React, { useState, useEffect, Profiler } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import GoogleLoginButton from './components/GoogleLoginButton';
import { authService } from './services/auth';
import './Styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      if (authService.isLoggedIn()) {
        try {
          const userProfile = await authService.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkLoggedInStatus();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId="343307486631-rgmf2b0f05h1jaij0ebbmip2jculivqo.apps.googleusercontent.com">
      <BrowserRouter>
        <Navbar />
  

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventTitle" element={<EventDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/council" element={<Council />} />
          <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
          <Route path="/clubs/:clubName" element={<ClubProfile />} />
          <Route 
            path="/profile" 
            element={<Profile user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />} 
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;