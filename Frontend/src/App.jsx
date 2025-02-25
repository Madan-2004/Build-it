import './Styles/index.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from './pages/home/Home';
import About from './pages/aboutus/AboutUs';
import Events from './pages/events/Events';
import Contact from './pages/contact';
import Council from './pages/Council';
import CouncilDetails from './pages/CouncilDetails';
import ClubProfile from './pages/ClubProfile';
import LoginPage from './pages/LoginPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route 
            path="/contact" 
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } 
          />
          <Route path="/council" element={<Council />} />
          <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
          <Route path="/clubs/:clubName" element={<ClubProfile />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
