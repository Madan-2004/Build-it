import './Styles/index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from './pages/home/Home';
import About from './pages/aboutus/AboutUs';
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetails';  // Import Event Details Page
import Contact from './pages/contact';
import Council from './pages/Council';
import CouncilDetails from './pages/CouncilDetails';
import ClubProfile from './pages/ClubProfile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventTitle" element={<EventDetails />} /> {/* Event Details Route */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/council" element={<Council />} />
        <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
        <Route path="/clubs/:clubName" element={<ClubProfile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
