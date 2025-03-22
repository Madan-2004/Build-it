import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  CircularProgress, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Typography
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProjectInventory = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", cost: "", consumable: "consumable" });
  const [editItem, setEditItem] = useState({ id: "", name: "", quantity: "", cost: "", consumable: "consumable" });
  const [budget, setBudget] = useState("");
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    // Fetch project name
    // fetch(`${API_BASE_URL}/projects/${projectId}/`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.project) {
    //       debugger
    //       setProjectName(data.project.project_name);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error loading project details:", error);
    //   });

    // Fetch inventory
    fetch(`${API_BASE_URL}/inventory/${projectId}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.inventory) {
          setProjectName(data.project_name)
          setInventory(data.inventory);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading inventory:", error);
        setLoading(false);
      });
  }, [projectId]);

  const handleAddItem = () => {
    fetch(`${API_BASE_URL}/api/inventory/${projectId}/add-item/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newItem,
        action: "add_item"
      }),
    })
      .then(() => {
        setAddDialogOpen(false);
        setNewItem({ name: "", quantity: "", cost: "", consumable: "consumable" });
        window.location.reload();
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const handleEditItem = () => {
    fetch(`${API_BASE_URL}/api/inventory/${projectId}/update-item/${editItem.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editItem,
        action: "update_item"
      }),
    })
      .then(() => {
        setEditDialogOpen(false);
        setEditItem({ id: "", name: "", quantity: "", cost: "", consumable: "consumable" });
        window.location.reload();
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const handleDeleteInventory = () => {
    fetch(`${API_BASE_URL}/api/inventory/${projectId}/delete/`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_inventory" }),
    })
      .then(response => response.json())
      .then(data => {
        setDeleteDialogOpen(false);
        // Reset inventory state to null to trigger the create inventory view
        setInventory(null);
        // Keep the current project name if available
        if (data.project_name) {
          setProjectName(data.project_name);
        }
        // No navigation needed - React will rerender the component with inventory=null
      })
      .catch((error) => {
        console.error("Error deleting inventory:", error);
        setDeleteDialogOpen(false);
      });
  };

  const handleCreateInventory = () => {
    if (!budget) {
      alert("Please enter a budget.");
      return;
    }
    fetch(`${API_BASE_URL}/api/inventory/${projectId}/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        budget_allocated: budget,
        action: "create_inventory"
      }),
    })
      .then(() => window.location.reload())
      .catch((error) => console.error("Error creating inventory:", error));
  };

  const openEditDialog = (item) => {
    setEditItem({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      cost: item.cost,
      consumable: item.consumable
    });
    setEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <CircularProgress color="primary" size={60} />
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full border border-gray-200">
          <Typography 
            variant="h4" 
            className="mb-2 text-center" 
            style={{ 
              background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            {projectName}
          </Typography>
          <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Create Inventory</h2>
          <p className="text-gray-600 mb-6 text-center">Set up a new inventory by allocating a budget for this project.</p>
          <div className="flex flex-col items-center gap-4">
            <TextField
              label="Budget Amount (₹)"
              type="number"
              variant="outlined"
              fullWidth
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mb-2"
            />
            <Button
              onClick={handleCreateInventory}
              variant="contained"
              color="primary"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              style={{ 
                borderRadius: "30px", 
                padding: "10px 30px", 
                backgroundColor: "#4285F4",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
                }
              }}
            >
              Create Inventory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalCost = inventory.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const budgetUsage = Math.min((totalCost / inventory.budget_allocated) * 100, 100);
  const budgetColor = budgetUsage >= 90 ? "#FF5252" : "#4CAF50";

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-gray-200">
        <Typography 
          variant="h4" 
          className="mb-2 text-center" 
          style={{ 
            background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          {projectName + ' Inventory'} 
        </Typography>

        {/* Budget Progress */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 rounded-lg">
          <div className="relative w-32 h-32 mb-4 sm:mb-0">
            <CircularProgress
              variant="determinate"
              value={budgetUsage}
              size={120}
              thickness={5}
              style={{ color: budgetColor
               }}
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-xl font-bold">{budgetUsage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <h3 className="text-xl font-semibold mb-2">Budget Details</h3>
            <p className="text-gray-600">
              <span className="font-medium">Allocated:</span> ₹{inventory.budget_allocated.toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Used:</span> ₹{totalCost.toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Remaining:</span> ₹{(inventory.budget_allocated - totalCost).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #1565C0, #1976D2)' }}>
                <th className="p-3 text-left font-semibold text-white">Name</th>
                <th className="p-3 text-left font-semibold text-white">Quantity</th>
                <th className="p-3 text-left font-semibold text-white">Cost (₹)</th>
                <th className="p-3 text-left font-semibold text-white">Type</th>
                <th className="p-3 text-center font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.items.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="border-b transition-colors duration-200 hover:bg-blue-50"
                  style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.cost.toLocaleString()}</td>
                  <td className="p-3 capitalize">{item.consumable}</td>
                  <td className="p-3 text-center">
                    <Button
                      onClick={() => openEditDialog(item)}
                      variant="contained"
                      size="small"
                      style={{ 
                        backgroundColor: " #1565C0",
                        textTransform: "none",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#00E676",
                          transform: "translateY(-3px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            style={{ 
              borderRadius: "30px", 
              padding: "10px 20px",
              backgroundColor: "#9C27B0",
              textTransform: "none",
              fontWeight: "bold",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#AB47BC",
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(156,39,176,0.3)"
              }
            }}
          >
            Add New Item
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDeleteDialogOpen(true)}
            style={{ 
              borderRadius: "30px", 
              padding: "10px 20px",
              backgroundColor: "#EA4335",
              textTransform: "none",
              fontWeight: "bold",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#F44336",
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(244,67,54,0.3)"
              }
            }}
          >
            Delete Inventory
          </Button>
        </div>

        {/* Add Item Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle className="text-xl font-bold bg-gray-50 py-4">Add Inventory Item</DialogTitle>
          <DialogContent className="flex flex-col gap-4 pt-4 mt-2">
            <TextField
              label="Item Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Cost per Unit (₹)"
              type="number"
              fullWidth
              value={newItem.cost}
              onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
              variant="outlined"
              margin="dense"
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select
                value={newItem.consumable}
                onChange={(e) => setNewItem({ ...newItem, consumable: e.target.value })}
                label="Type"
              >
                <MenuItem value="consumable">Consumable</MenuItem>
                <MenuItem value="non-consumable">Non-Consumable</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions className="bg-gray-50 py-3 px-4">
            <Button 
              onClick={() => setAddDialogOpen(false)} 
              color="secondary"
              style={{ 
                borderRadius: "20px",
                textTransform: "none",
                transition: "transform 0.2s"
              }}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)"
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddItem} 
              variant="contained"
              style={{ 
                borderRadius: "20px",
                backgroundColor: "#9C27B0",
                textTransform: "none",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#AB47BC",
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(156,39,176,0.3)"
                }
              }}
            >
              Add Item
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle className="text-xl font-bold bg-gray-50 py-4">Edit Inventory Item</DialogTitle>
          <DialogContent className="flex flex-col gap-4 pt-4 mt-2">
            <TextField
              label="Item Name"
              fullWidth
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={editItem.quantity}
              onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Cost per Unit (₹)"
              type="number"
              fullWidth
              value={editItem.cost}
              onChange={(e) => setEditItem({ ...editItem, cost: e.target.value })}
              variant="outlined"
              margin="dense"
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select
                value={editItem.consumable}
                onChange={(e) => setEditItem({ ...editItem, consumable: e.target.value })}
                label="Type"
              >
                <MenuItem value="consumable">Consumable</MenuItem>
                <MenuItem value="non-consumable">Non-Consumable</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions className="bg-gray-50 py-3 px-4">
            <Button 
              onClick={() => setEditDialogOpen(false)} 
              color="secondary"
              style={{ 
                borderRadius: "20px",
                textTransform: "none",
                transition: "transform 0.2s"
              }}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)"
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditItem} 
              variant="contained"
              style={{ 
                borderRadius: "20px",
                backgroundColor: "#00C853",
                textTransform: "none",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#00E676",
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(0,200,83,0.3)"
                }
              }}
            >
              Update Item
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
          <DialogContent>
            <p className="my-4">Are you sure you want to delete this inventory? This action cannot be undone.</p>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)} 
              style={{ 
                borderRadius: "20px",
                textTransform: "none"
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteInventory} 
              variant="contained"
              color="error"
              style={{ 
                borderRadius: "20px", 
                backgroundColor: "#F44336",
                textTransform: "none"
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectInventory;