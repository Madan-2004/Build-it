import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from "@mui/icons-material/Inventory";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';

const API_BASE_URL = "http://localhost:8000";

const getImagePlaceholder = (title) => {
  // Generate a placeholder image URL based on the project title
  return `https://placehold.co/300x200`;
};

const ClubProjects = ({ clubId, darkMode, setDarkMode }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    title: "",
    description: "",
    images: [],
    start_date: null,
    end_date: null,
    status: "ongoing"
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenCarouselOpen, setFullScreenCarouselOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

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
      const response = await axios.get(`${API_BASE_URL}/api/clubs/${clubId}/projects/`);
      const data = response.data;
      setProjects(
        data.map((project) => ({
          ...project,
          images: project.images || [], // Always ensure images are an array
        })),
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again later.");
      showSnackbar("Failed to load projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Check file sizes
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      showSnackbar("Some images exceed the 5MB size limit and were not added", "warning");
      return;
    }
    
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      showSnackbar("Only image files are allowed", "warning");
    }

    setCurrentProject((prev) => {
      const currentImages = prev.images || [];
      const newImages = [
        ...currentImages,
        ...validFiles.slice(0, 5 - currentImages.length),
      ];
      
      if (newImages.length >= 5 && validFiles.length > (5 - currentImages.length)) {
        showSnackbar("Maximum 5 images allowed - only added what was possible", "info");
      }
      
      return {
        ...prev,
        images: newImages,
      };
    });
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
      start_date: project.start_date,
      end_date: project.end_date,
      status: project.status
    });
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const validateProject = () => {
    if (!currentProject.title.trim()) {
      showSnackbar("Please enter a project title", "error");
      return false;
    }
    if (!currentProject.description.trim()) {
      showSnackbar("Please enter a project description", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateProject()) return;
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", currentProject.title.trim());
      formData.append("description", currentProject.description.trim());
      formData.append("start_date", dayjs(currentProject.start_date).format('YYYY-MM-DD'));
      formData.append("status", currentProject.status);
      
      if (currentProject.end_date) {
        formData.append("end_date", dayjs(currentProject.end_date).format('YYYY-MM-DD'));
      }
  
      if (currentProject.images) {
        const existingImages = currentProject.images.filter(img => !(img instanceof File));
        const newImages = currentProject.images.filter(img => img instanceof File);
        formData.append("existing_images", JSON.stringify(existingImages.map(img => img.image || img)));
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
      showSnackbar(
        dialogMode === "add" ? "Project created successfully!" : "Project updated successfully!",
        "success"
      );
      fetchProjects();
    } catch (error) {
      console.error("Error submitting project:", error);
      showSnackbar(
        `Failed to ${dialogMode === "add" ? "create" : "update"} project. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete(
        `${API_BASE_URL}/api/clubs/${clubId}/projects/${projectId}/`
      );

      showSnackbar("Project deleted successfully", "success");
      fetchProjects();
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      showSnackbar("Failed to delete project. Please try again.", "error");
    } finally {
      setIsLoading(false);
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

  const openFullScreenCarousel = (e) => {
    e.stopPropagation();
    if (selectedProject?.images?.length > 0) {
      setFullScreenCarouselOpen(true);
    }
  };

  const closeFullScreenCarousel = () => {
    setFullScreenCarouselOpen(false);
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

  // Handle navigation to the project's inventory page
  const handleViewInventory = (id) => {
    navigate(`/inventory/projects/${id}`);
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"} ${darkMode ? "text-white" : "text-gray-900"} rounded-lg shadow-xl transition-colors duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Club Projects</h2>
        <div className="flex items-center gap-3">
         
          <Button
            variant="contained"
            color="primary"
            onClick={openAddDialog}
            startIcon={<AddAPhotoIcon />}
            className={`${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Add Project
          </Button>
        </div>
      </div>

      {/* Error Banner (if any) */}
      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-white hover:text-gray-200"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? "bg-gray-700/50 border-gray-600/50" : "bg-gray-100 border-gray-200/50"} rounded-xl border`}>
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
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg font-semibold mb-2`}>
            No projects yet
          </p>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
            Showcase your club's achievements by adding your first project!
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddDialog}
            startIcon={<AddAPhotoIcon />}
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
                      : getImagePlaceholder(project.title)
                  }
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImagePlaceholder(project.title);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Button 
                    variant="contained"
                    color="primary"
                    size="small"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={(e) => { e.stopPropagation(); openProjectDetails(project); }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className={`p-5 ${darkMode ? "bg-gray-800" : "bg-gray-50"} flex-grow flex flex-col`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} group-hover:text-blue-400 transition-colors duration-300 flex-grow line-clamp-1`}>
                    {project.title}
                  </h3>
                  <div className="flex space-x-1 ml-2">
                    <Tooltip title="Edit Project">
                      <IconButton
                        size="small"
                        onClick={(e) => openEditDialog(project, e)}
                        className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20"
                        aria-label="Edit project"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Project">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(project.id, e)}
                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                        aria-label="Delete project"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Inventory">
                      <IconButton
                        size="small"
                        onClick={(e) => handleViewInventory(project.id, e)}
                        className="text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20"
                        aria-label="View inventory"
                      >
                        <InventoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} line-clamp-3 mb-4 text-sm flex-grow`}>
                  {project.description}
                </p>
                {/* <div className="mb-3">
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Started: {dayjs(project.start_date).format('MMM D, YYYY')}
                  </div>
                  {project.end_date && (
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Ends: {dayjs(project.end_date).format('MMM D, YYYY')}
                    </div>
                  )}
                </div> */}
                {/* <div className="flex items-center gap-2">
                  {project.status === "completed" ? (
                    <Tooltip title="Completed">
                      <CheckCircleIcon className="text-green-500" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Ongoing">
                      <PendingIcon className="text-blue-500" />
                    </Tooltip>
                  )}
                </div> */}
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
              
              <div class="relative h-full flex flex-col justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-700">

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

         {/* Inventory Button */}
         <IconButton
            onClick={() => navigate(`/inventory/projects/${selectedProject.id}`)}   // Navigate to inventory page
            className="bg-green-500/10 hover:bg-green-500/20 text-green-400"
          >
          <InventoryIcon sx={{ fontSize: 20 }} />            
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                    Project Gallery
                    {selectedProject.images?.length > 0 && (
                      <span className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        ({currentImageIndex + 1} of {selectedProject.images?.length})
                      </span>
                    )}
                  </h3>
                  {selectedProject.images?.length > 0 && (
                    <Tooltip title="View Fullscreen">
                      <IconButton 
                        size="small" 
                        onClick={openFullScreenCarousel}
                        className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                
                <div className="relative group">
                  {selectedProject.images?.length > 0 ? (
                    <img
                      src={selectedProject.images?.[currentImageIndex]?.image}
                      alt={selectedProject.title}
                      className="w-full h-72 object-contain rounded-lg bg-gray-800/50"
                      onClick={openFullScreenCarousel}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImagePlaceholder(selectedProject.title);
                      }}
                    />
                  ) : (
                    <div className="w-full h-72 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">No images available</p>
                    </div>
                  )}
                  
                  {selectedProject.images?.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => prevImage(e)}
                        className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transform -translate-x-2 transition"
                      >
                        <ArrowBackIosIcon />
                      </button>
                      <button
                        onClick={(e) => nextImage(e)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx 
                            ? 'border-blue-500 opacity-100' 
                            : `${darkMode ? 'border-gray-700' : 'border-gray-300'} opacity-50 hover:opacity-100`
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getImagePlaceholder(selectedProject.title);
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="space-y-4 h-full flex flex-col">
                <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Project Description
                </h3>
                <div className={`${darkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-100/50 border-gray-200/50"} rounded-lg backdrop-blur-sm border flex-grow overflow-hidden`}>
                  <div className="p-4 overflow-y-auto custom-scrollbar max-h-[400px]">
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed whitespace-pre-line`}>
                      {selectedProject.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full screen carousel */}
      {selectedProject && fullScreenCarouselOpen && (
        <div
          className={`fixed inset-0 ${darkMode ? "bg-black/95" : "bg-black/90"} flex items-center justify-center z-[70]`}
          onClick={closeFullScreenCarousel}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedProject.images?.length > 0 ? (
              <img
                src={selectedProject.images?.[currentImageIndex]?.image}
                alt={selectedProject.title}
                className="max-w-[90%] max-h-[90%] object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getImagePlaceholder(selectedProject.title);
                }}
              />
            ) : (
              <div className="text-white text-xl">No images available</div>
            )}

            {selectedProject?.images?.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(e);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 w-12 h-12 flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ArrowBackIosIcon />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(e);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 w-12 h-12 flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ArrowForwardIosIcon />
                </button>
              </>
            )}

            <button
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              onClick={closeFullScreenCarousel}
            >
              <CloseIcon />
            </button>

            {selectedProject?.images?.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/70 rounded-full px-4 py-2 text-sm text-white">
                  {currentImageIndex + 1} / {selectedProject?.images?.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Project Dialog */}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <DatePicker
                label="Start Date"
                value={dayjs(currentProject.start_date)}
                onChange={(newValue) => {
                  setCurrentProject(prev => ({
                    ...prev,
                    start_date: newValue
                  }));
                }}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    className: darkMode ? "bg-gray-700 rounded-lg" : ""
                  }
                }}
              />
              <DatePicker
                label="End Date"
                value={currentProject.end_date ? dayjs(currentProject.end_date) : null}
                onChange={(newValue) => {
                  setCurrentProject(prev => ({
                    ...prev,
                    end_date: newValue
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    className: darkMode ? "bg-gray-700 rounded-lg" : ""
                  }
                }}
              />
            </div>
          </LocalizationProvider>
          <TextField
            select
            label="Status"
            fullWidth
            variant="outlined"
            margin="normal"
            name="status"
            value={currentProject.status}
            onChange={handleInputChange}
            className={darkMode ? "bg-gray-700 rounded-lg" : ""}
          >
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
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
