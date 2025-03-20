import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/council.css";
import { motion } from "framer-motion"; // Add this import
import CouncilHeadsDisplay from "./CouncilHeadsDisplay";

function Council() {
  const [councils, setCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL =  "http://127.0.0.1:8000";
  // const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetchCouncils();
  }, []);

  const fetchCouncils = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/councils/`);
      setCouncils(response.data);
    } catch (error) {
      console.error("Error fetching councils:", error);
      setError("Unable to load councils. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="loading-pulse">
          <div className="spinner-wave"></div>
          <p className="text-lg text-gray-600 mt-4">Loading councils...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="error-container text-center">
          <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl text-gray-800 mb-4">{error}</p>
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={fetchCouncils}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            Student Councils
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Discover our vibrant student councils and their initiatives
          </motion.p>
        </div>
  
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {councils.map((council) => (
            <motion.div
              key={council.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/council/${encodeURIComponent(council.name)}/clubs`}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={`${BASE_URL}${council.image}`}
                    alt={council.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/default-council.jpg";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {council.name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {council.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Explore Clubs
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
  
      {/* ✅ Added Council Heads Display at the end */}
      <div className="relative mt-16 z-10">
        <CouncilHeadsDisplay />
      </div>
    </motion.div>
  );
}

export default Council;