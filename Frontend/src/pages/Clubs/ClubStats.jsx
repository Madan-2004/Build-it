import React, { useState, useEffect } from "react";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from "@mui/material";
import clsx from "clsx";

const API_BASE_URL = "http://localhost:8000";

const ClubStats = ({ club, darkMode }) => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInventory, setEditInventory] = useState({
    budget_allocated: 0,
    budget_used: 0
  });

  useEffect(() => {
    const fetchInventory = async () => {
      if (!club?.name) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/clubs/${club.name}/inventory/`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setInventory(data[0] || {});
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        setError("Failed to fetch inventory data");
        setLoading(false);
      }
    };

    fetchInventory();
  }, [club?.name]);

  const handleEditOpen = () => {
    setEditInventory({
      budget_allocated: inventory?.budget_allocated || 0,
      budget_used: inventory?.budget_used || 0
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/${club.name}/inventory/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget_allocated: editInventory.budget_allocated,
          budget_used: editInventory.budget_used,
        }),
      });
      
      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      setInventory(data);
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-6 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className={clsx(darkMode ? "bg-gray-800" : "bg-white", "rounded-xl shadow-xl overflow-hidden")}>
      {/* Header */}
      <div className={clsx("px-6 py-4", darkMode ? "bg-gradient-to-r from-blue-800 to-indigo-900" : "bg-gradient-to-r from-blue-500 to-indigo-500")}>
        <h2 className="text-xl font-bold text-white flex items-center">
          📊 Club Stats
        </h2>
      </div>

      {/* Club Statistics */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
            <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Members</p>
            <p className={clsx("text-3xl font-bold", darkMode ? "text-blue-400" : "text-blue-600")}>
              {club?.members?.length || 0}
            </p>
          </div>
          <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
            <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Founded</p>
            <p className={clsx("text-xl font-bold", darkMode ? "text-blue-400" : "text-blue-600")}>
              {club?.founded || "N/A"}
            </p>
          </div>
        </div>

        {/* Inventory Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">📦 Inventory Details</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
              <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Budget Allocated</p>
              <p className={clsx("text-xl font-bold", darkMode ? "text-green-400" : "text-green-600")}>
                ₹ {inventory?.budget_allocated || 0}
              </p>
            </div>
            <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
              <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Budget Used</p>
              <p className={clsx("text-xl font-bold", darkMode ? "text-red-400" : "text-red-600")}>
                ₹ {inventory?.budget_used || 0}
              </p>
            </div>
            <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center col-span-2")}>
              <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Remaining Budget</p>
              <p className={clsx("text-xl font-bold", darkMode ? "text-yellow-400" : "text-yellow-600")}>
                ₹ {(inventory?.budget_allocated || 0) - (inventory?.budget_used || 0)}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleEditOpen}
            variant="contained"
            style={{ 
              marginTop: '1rem',
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
            Edit
          </Button>
        </div>
      </div>

      {/* Edit Inventory Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold bg-gray-50 py-4">
          Edit Club Inventory
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4 mt-2">
          <TextField
            label="Budget Allocated (₹)"
            type="number"
            fullWidth
            value={editInventory.budget_allocated}
            onChange={(e) => setEditInventory({
              ...editInventory, 
              budget_allocated: Number(e.target.value)
            })}
            variant="outlined"
            margin="dense"
          />
          <TextField
            label="Budget Used (₹)"
            type="number"
            fullWidth
            value={editInventory.budget_used}
            onChange={(e) => setEditInventory({
              ...editInventory, 
              budget_used: Number(e.target.value)
            })}
            variant="outlined"
            margin="dense"
          />
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
            onClick={handleEditSubmit} 
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClubStats;