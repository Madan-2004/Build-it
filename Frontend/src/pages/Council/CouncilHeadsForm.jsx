import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE_URL = "http://localhost:8000/api/council-heads/";

const CouncilHeadsForm = ({ head, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    linkedin: '',
    image: null,
  });

  const isEditMode = !!head; // Check if we're in edit mode

  useEffect(() => {
    if (head) {
      // Only set form data if we're editing
      setFormData({
        name: head.name || '',
        position: head.position || '',
        email: head.email || '',
        linkedin: head.linkedin || '',
        image: head.image || null,
      });
    }
  }, [head]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url: isEditMode ? `${API_BASE_URL}${head.id}/` : API_BASE_URL,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving council head:', error);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center">
        <span>{isEditMode ? 'Edit Council Head' : 'Add New Council Head'}</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {formData.image ? 'Change Image' : 'Upload Image'}
              </label>
              {formData.image && (
                <span className="ml-3 text-sm text-gray-500">
                  {formData.image instanceof File ? formData.image.name : 'Current image'}
                </span>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CouncilHeadsForm;
