import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const ClubProjects = ({ clubId }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchProjects();
  }, [clubId]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${clubId}/projects/`,
      );
      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      setProjects(
        data.map((project) => ({
          ...project,
          images: project.images || [], // Always ensure images are an array
        })),
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCurrentProject((prev) => ({
      ...prev,
      images: [
        ...(prev.images || []),
        ...files.slice(0, 5 - (prev.images?.length || 0)),
      ],
    }));
  };

  const removeImage = (index) => {
    setCurrentProject((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const openAddDialog = () => {
    setCurrentProject({ title: "", description: "", images: [] });
    setDialogMode("add");
    setDialogOpen(true);
  };

  const openEditDialog = (project, e) => {
    e.stopPropagation();
    setCurrentProject({
      id: project.id,
      title: project.title,
      description: project.description,
      images: project.images || [],
    });
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", currentProject.title);
      formData.append("description", currentProject.description);
  
      if (currentProject.images) {
        // Fix: Ensure correct filtering of existing images
        const existingImages = currentProject.images.filter(img => !(img instanceof File));
        const newImages = currentProject.images.filter(img => img instanceof File);
  
        // Fix: Send existing images as a JSON string
        formData.append("existing_images", JSON.stringify(existingImages.map(img => img.image || img)));
  
        // Append new images
        newImages.forEach(img => {
          formData.append("image_uploads", img);
        });
      }
  
      const url = dialogMode === "add" 
        ? `${API_BASE_URL}/api/clubs/${clubId}/projects/` 
        : `${API_BASE_URL}/api/clubs/${clubId}/projects/${currentProject.id}/`;
  
      await axios({
        method: dialogMode === "add" ? "post" : "patch",
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      setDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error submitting project:", error);
      setError("Failed to save project");
    }
  };
  

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clubs/${clubId}/projects/${projectId}/`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete project");

      fetchProjects();
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  const openProjectDetails = (project) => {
    setSelectedProject({
      ...project,
      images: project.images || [], // Ensure images exist
    });
    setCurrentImageIndex(0);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!selectedProject || selectedProject?.images?.length <= 1) return;
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % selectedProject?.images?.length,
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selectedProject || selectedProject?.images?.length <= 1) return;
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedProject?.images?.length) %
        selectedProject?.images?.length,
    );
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"} ${darkMode ? "text-white" : "text-gray-900"} rounded-lg shadow-xl transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Club Projects</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddDialog}
            className={`${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Add Project
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-blue-400">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-700/50 rounded-xl border border-gray-600/50">
          <div className="mb-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-gray-300 text-lg font-semibold mb-2">
            No projects yet
          </p>
          <p className="text-gray-400 mb-6">
            Showcase your club's achievements by adding your first project!
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddDialog}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-2 rounded-full shadow-lg"
          >
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${
                darkMode 
                  ? "bg-gray-700 border-gray-600/30" 
                  : "bg-white border-gray-200"
              } rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] border flex flex-col h-full`}
              onClick={() => openProjectDetails(project)}
            >
              <div className="h-48 overflow-hidden relative group">
                <img
                  src={
                    project.images && project.images.length > 0
                      ? project.images[0].image
                      : "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className={`p-5 ${darkMode ? "bg-gray-800" : "bg-gray-50"} flex-grow flex flex-col`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} group-hover:text-blue-400 transition-colors duration-300 flex-grow`}>
                    {project.title}
                  </h3>
                  <div className="flex space-x-1 ml-2">
                    <IconButton
                      size="small"
                      onClick={(e) => openEditDialog(project, e)}
                      className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20"
                      aria-label="Edit project"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(project.id, e)}
                      className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                      aria-label="Delete project"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} line-clamp-3 mb-4 text-sm flex-grow`}>
                  {project.description}
                </p>
                <div className={`flex justify-between items-center mt-auto pt-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {project.images?.length || 0} {project.images?.length === 1 ? "image" : "images"}
                  </span>
                  <span className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 md:p-6 backdrop-blur-sm"
          onClick={closeProjectDetails}
        >
          <div
            className={`bg-gradient-to-b ${
              darkMode 
                ? "from-gray-800 to-gray-900" 
                : "from-white to-gray-50"
            } rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modern Header */}
            <div className="relative h-64 md:h-[5rem]">
              <div className="absolute inset-0">
                <img
                  src={selectedProject.images?.[0]?.image || "https://via.placeholder.com/1200x400"}
                  alt=""
                  className="w-full h-full object-cover filter blur-sm opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900"></div>
              </div>
              
              <div className="relative h-full flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {selectedProject.title}
                    </h2>
                  </div>
                  <div className="flex gap-2">
        <IconButton
          onClick={(e) => openEditDialog(selectedProject, e)}
          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(e) => handleDelete(selectedProject.id, e)}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400"
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={closeProjectDetails}
          className="bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 hover:text-white transition-colors"
  >
    <CloseIcon sx={{ fontSize: 28 }} /> {/* Increased icon size */}
        </IconButton>
      </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                  <span>Project Gallery</span>
                  <span className="text-sm text-gray-500">
                    ({currentImageIndex + 1} of {selectedProject.images?.length || 0})
                  </span>
                </h3>
                
                <div className="relative group">
                  <img
                    src={selectedProject.images?.[currentImageIndex]?.image}
                    alt={selectedProject.title}
                    className="w-full h-72 object-contain rounded-lg bg-gray-800/50"
                  />
                  
                  {selectedProject.images?.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                        className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transform -translate-x-2 transition"
                      >
                        <ArrowBackIosIcon />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                        className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transform translate-x-2 transition"
                      >
                        <ArrowForwardIosIcon />
                      </button>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedProject.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProject.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx 
                            ? 'border-blue-500 opacity-100' 
                            : 'border-gray-700 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Details */}
     <div className="space-y-4 h-full flex flex-col">
  <div className="flex-grow flex flex-col">
    <h3 className="text-lg font-semibold text-gray-300 mb-2">
      Project Description
    </h3>
    <div className="bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50 flex-grow">
      <div className="p-4 overflow-y-auto custom-scrollbar max-h-[400px] pb-4">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {selectedProject.description}
        </p>
      </div>
    </div>
  </div>
</div>



            </div>
          </div>
        </div>
      )}

      {/* Full screen image carousel */}
      {selectedProject && (
        <div
          id="fullScreenCarousel"
          className={`fixed inset-0 ${darkMode ? "bg-black/95" : "bg-white/95"} flex items-center justify-center z-[60] hidden`}
          onClick={() =>
            document
              .getElementById("fullScreenCarousel")
              .classList.add("hidden")
          }
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                selectedProject.images && selectedProject.images.length > 0
                  ? selectedProject.images[currentImageIndex].image
                  : "https://via.placeholder.com/600x400?text=No+Image"
              }
              alt={selectedProject.title}
              className="max-w-[90%] max-h-[90%] object-contain"
            />

            {selectedProject?.images?.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(e);
                  }}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    darkMode 
                      ? "bg-black/50 hover:bg-black/70" 
                      : "bg-gray-800/50 hover:bg-gray-800/70"
                  } text-white p-3 rounded-full z-10 w-12 h-12 flex items-center justify-center`}
                  aria-label="Previous image"
                >
                  <ArrowBackIosIcon />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(e);
                  }}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    darkMode 
                      ? "bg-black/50 hover:bg-black/70" 
                      : "bg-gray-800/50 hover:bg-gray-800/70"
                  } text-white p-3 rounded-full z-10 w-12 h-12 flex items-center justify-center`}
                  aria-label="Next image"
                >
                  <ArrowForwardIosIcon />
                </button>
              </>
            )}

            <button
              className={`absolute top-4 right-4 ${
                darkMode 
                  ? "bg-black/50 hover:bg-black/70" 
                  : "bg-gray-800/50 hover:bg-gray-800/70"
              } text-white p-3 rounded-full`}
              onClick={() =>
                document
                  .getElementById("fullScreenCarousel")
                  .classList.add("hidden")
              }
            >
              <span className="text-xl">×</span>
            </button>

            {selectedProject?.images?.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className={`${
                  darkMode 
                    ? "bg-black/70" 
                    : "bg-gray-800/70"
                } rounded-full px-4 py-2 text-sm text-white`}>
                  {currentImageIndex + 1} / {selectedProject?.images?.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#ffffff' : '#111827',
          },
          className: `${darkMode ? "border border-gray-700" : "border border-gray-200"}`,
        }}
      >
        <DialogTitle className={darkMode ? "text-white" : "text-gray-900"}>
          {dialogMode === "add" ? "Add New Project" : "Edit Project"}
        </DialogTitle>
        <DialogContent className={darkMode ? "bg-gray-800" : "bg-white"}>
          <TextField
            label="Project Title"
            fullWidth
            variant="outlined"
            margin="normal"
            name="title"
            value={currentProject.title}
            onChange={handleInputChange}
            required
            className={darkMode ? "bg-gray-700 rounded-lg" : ""}
            InputLabelProps={{
              style: { color: darkMode ? '#9ca3af' : undefined },
            }}
            InputProps={{
              style: { color: darkMode ? '#ffffff' : undefined },
            }}
          />
          <TextField
            label="Project Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            name="description"
            value={currentProject.description}
            onChange={handleInputChange}
            required
          />
          <div className="mt-4">
            <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Project Images (up to 5)
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className={`w-full border p-2 rounded ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-300" 
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              disabled={currentProject?.images?.length >= 5}
            />
            <div className="flex flex-wrap mt-2">
              {currentProject?.images?.map((image, index) => (
                <div key={index} className="relative m-1">
                  <img
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : image.image || image
                    }
                    alt={`Project image ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {dialogMode === "add" ? "Add Project" : "Update Project"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClubProjects;
