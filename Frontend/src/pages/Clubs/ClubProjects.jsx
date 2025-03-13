import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, IconButton, Card, CardContent
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const API_BASE_URL = "http://localhost:8000";

const ClubProjects = ({ clubId }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({ title: "", description: "", image: null });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      const projectsWithImages = data.map(project => ({
        ...project,
        images: project.image ? [project.image] : []
      }));
      setProjects(projectsWithImages);
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

  const openEditDialog = (project, e) => {
    e.stopPropagation();
    setCurrentProject({
      id: project.id,
      title: project.title,
      description: project.description,
      image: null,
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

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${clubId}/projects/${projectId}/`, {
        method: "DELETE",
      });

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
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!selectedProject || selectedProject.images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProject.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selectedProject || selectedProject.images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProject.images.length) % selectedProject.images.length);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col"
              onClick={() => openProjectDetails(project)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="bg-gray-900 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <div className="flex space-x-1">
                    <IconButton 
                      size="small" 
                      onClick={(e) => openEditDialog(project, e)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleDelete(project.id, e)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
                <p className="text-gray-300 line-clamp-2 flex-grow">
                  {project.description.substring(0, 100)}
                  {project.description.length > 100 ? '...' : ''}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeProjectDetails}>
          <div className="bg-gray-800 rounded-lg shadow-2xl w-4/5 max-w-6xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 h-64 md:h-96 relative bg-black flex items-center justify-center">
                <img
                  src={selectedProject.images[0] || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(0);
                    document.getElementById('imageCarousel').classList.remove('hidden');
                  }}
                />
              </div>
              <div className="md:w-1/2 p-6 overflow-y-auto max-h-[90vh] md:max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                  <div className="flex space-x-2">
                    <IconButton 
                      size="small" 
                      onClick={(e) => openEditDialog(selectedProject, e)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleDelete(selectedProject.id, e)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300 whitespace-pre-line">{selectedProject.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={closeProjectDetails}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProject && (
        <div 
          id="imageCarousel" 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 hidden"
          onClick={() => document.getElementById('imageCarousel').classList.add('hidden')}
        >
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedProject.images[currentImageIndex] || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={selectedProject.title}
              className="max-w-full max-h-full object-contain"
            />
            {selectedProject.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(e);
                  }} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-10 flex items-center justify-center w-12 h-12"
                  aria-label="Previous image"
                >
                  <ArrowBackIosIcon />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(e);
                  }} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-10 flex items-center justify-center w-12 h-12"
                  aria-label="Next image"
                >
                  <ArrowForwardIosIcon />
                </button>
              </>
            )}
            <button 
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
              onClick={() => document.getElementById('imageCarousel').classList.add('hidden')}
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
