import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import AddIcon from "@mui/icons-material/Add";
import CouncilHeadsForm from "./CouncilHeadsForm";

const API_BASE_URL = "http://localhost:8000/api/council-heads/";

const CouncilHeadsDisplay = () => {
  const [heads, setHeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHead, setSelectedHead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCouncilHeads();
  }, []);

  const fetchCouncilHeads = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_BASE_URL);
      setHeads(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching council heads:", error);
      setError("Failed to load council heads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (head) => {
    setSelectedHead(head);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this council head?")) {
      try {
        await axios.delete(`${API_BASE_URL}${id}/`);
        setHeads(heads.filter((head) => head.id !== id));
      } catch (error) {
        console.error("Error deleting council head:", error);
        setError("Failed to delete council head");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Council Heads</h2>
        <IconButton
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <AddIcon />
        </IconButton>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {heads.map((head) => (
            <div
              key={head.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl p-5 text-center transform transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="absolute top-2 right-2 flex space-x-1">
                <IconButton
                  size="small"
                  onClick={() => handleEdit(head)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(head.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>

              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={head.image || "https://via.placeholder.com/150"}
                  alt={head.name}
                  className="w-full h-full rounded-full object-cover border-4 border-blue-100 shadow-md"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                {head.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                {head.position}
              </p>

              <div className="flex justify-center space-x-3">
                {head.email && (
                  <IconButton
                    size="small"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    component="a"
                    href={`mailto:${head.email}`}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                )}
                {head.linkedin && (
                  <IconButton
                    size="small"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    component="a"
                    href={head.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <CouncilHeadsForm
          head={selectedHead}
          onClose={() => setIsFormOpen(false)}
          onSave={fetchCouncilHeads}
        />
      )}
    </div>
  );
};

export default CouncilHeadsDisplay;
