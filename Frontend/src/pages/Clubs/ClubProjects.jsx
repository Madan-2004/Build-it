import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, IconButton, Card, CardContent
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const API_BASE_URL = "http://localhost:8000"; // Update API URL if needed

const ClubProjects = ({ clubId }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({ title: "", description: "", image: null });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);


  useEffect(() => {
    fetchProjects();
  }, [clubId]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${clubId}/projects/`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      
      const data = await response.json();
      setProjects(data);
      if (data.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setCurrentProject({ ...currentProject, image: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const openAddDialog = () => {
    setCurrentProject({ title: "", description: "", image: null });
    setDialogMode("add");
    setDialogOpen(true);
  };

  const openEditDialog = (project) => {
    setCurrentProject({
      id: project.id,
      title: project.title,
      description: project.description,
      image: null, // Can't populate the file input, but we'll keep existing image if no new one
    });
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", currentProject.title);
    formData.append("description", currentProject.description);
    if (currentProject.image) {
      formData.append("image", currentProject.image);
    }

    try {
      let response;
      if (dialogMode === "add") {
        response = await fetch(`${API_BASE_URL}/api/clubs/${clubId}/projects/`, {
          method: "POST",
          body: formData,
        });
      } else {
        // For edit, we need to use the PATCH method to update only changed fields
        response = await fetch(`${API_BASE_URL}/api/clubs/${clubId}/projects/${currentProject.id}/`, {
          method: "PATCH",
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Operation failed");
      }

      setDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error(`Error ${dialogMode === "add" ? "adding" : "updating"} project:`, error);
      setError(`Failed to ${dialogMode === "add" ? "add" : "update"} project. ${error.message}`);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${clubId}/projects/${projectId}/`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      // Update projects and adjust current index if needed
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  const nextProject = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevProject = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Club Projects</h2>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={openAddDialog}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Project
        </Button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 bg-gray-700 rounded-lg">
          <p className="text-gray-300">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <div className="mt-6">
        {projects.length > 0 && (
          <div className="relative">
            <Card className="bg-gray-700 overflow-hidden rounded-lg shadow-lg relative">
             {/* Navigation arrows - now subtly visible */}
{projects.length > 1 && (
  <>
    <button 
      onClick={prevProject} 
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-10 flex items-center justify-center w-10 h-10 opacity-40 hover:opacity-80 transition-opacity"
      aria-label="Previous project"
    >
      <ArrowBackIosIcon fontSize="small" />
    </button>
    <button 
      onClick={nextProject} 
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-10 flex items-center justify-center w-10 h-10 opacity-40 hover:opacity-80 transition-opacity"
      aria-label="Next project"
    >
      <ArrowForwardIosIcon fontSize="small" />
    </button>
  </>
)}

      
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 h-48 md:h-64">
                  <img
                    src={projects[currentIndex].image || "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={projects[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                </div>
      
                {/* Content Section */}
                <div className="md:w-1/2 p-6 bg-gray-900 shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl font-bold text-white">{projects[currentIndex].title}</h3>
                    <div className="flex space-x-1">
                      <IconButton 
                        size="small" 
                        onClick={() => openEditDialog(projects[currentIndex])}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(projects[currentIndex].id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
      
                  <p className="text-gray-300 mt-2 whitespace-pre-line p-4 rounded-lg">
                    {showFullDescription 
                      ? projects[currentIndex].description 
                      : `${projects[currentIndex].description.substring(0, 100)}${projects[currentIndex].description.length > 100 ? '...' : ''}`}
                  </p>
                  {projects[currentIndex].description.length > 100 && (
                    <button 
                      className="text-blue-400 hover:text-blue-300 mt-2"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      
      )}

      {/* Project Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add" ? "Add New Project" : "Edit Project"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Project Title"
            fullWidth
            variant="outlined"
            margin="normal"
            name="title"
            value={currentProject.title}
            onChange={handleInputChange}
            required
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
            <p className="mb-2 text-gray-700">Project Image</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full border p-2 rounded"
            />
            {dialogMode === "edit" && !currentProject.image && (
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to keep the existing image
              </p>
            )}
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