import './Styles/index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from './pages/home/Home';
import About from './pages/about';
import Contact from './pages/contact';
import Council from './pages/Council';
import CouncilDetails from './pages/CouncilDetails';
// import SignUp from './pages/signup';
// import SignIn from './pages/signin';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/council" element={<Council />} />
        <Route path="/council/:councilName/clubs" element={<CouncilDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

