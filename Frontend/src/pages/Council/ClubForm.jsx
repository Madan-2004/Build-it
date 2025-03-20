import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ClubForm = ({ onSubmit, onClose, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        head: initialData?.head || "",
        description: initialData?.description || "",
        logo: null,
        contactEmail: initialData?.contactEmail || "",
        meetingLocation: initialData?.meetingLocation || "",
        meetingTime: initialData?.meetingTime || ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(initialData?.logo || null);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Club name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = "Invalid email format";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, logo: "Image size should be less than 5MB" });
                return;
            }
            setFormData({ ...formData, logo: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== "") {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await onSubmit(formDataToSend);
            onClose();
        } catch (error) {
            console.error("Form submission error:", error);
            setErrors({ submit: "Failed to submit form. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    {initialData ? "Edit Club" : "Create New Club"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-full overflow-hidden border-2 
                                ${previewUrl ? 'border-blue-500' : 'border-dashed border-gray-600'}
                                flex items-center justify-center bg-gray-800 hover:bg-gray-700 
                                transition-all duration-300`}
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Club logo preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <CloudUploadIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {errors.logo && (
                                <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            fullWidth
                            label="Club Name"
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                            className="bg-gray-800/50"
                        />
                        
                        <TextField
                            fullWidth
                            label="Club Head"
                            variant="outlined"
                            value={formData.head}
                            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                            className="bg-gray-800/50"
                        />

                        <TextField
                            fullWidth
                            label="Contact Email"
                            type="email"
                            variant="outlined"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            error={!!errors.contactEmail}
                            helperText={errors.contactEmail}
                            className="bg-gray-800/50"
                        />

                        <TextField
                            fullWidth
                            label="Meeting Location"
                            variant="outlined"
                            value={formData.meetingLocation}
                            onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                            className="bg-gray-800/50"
                        />
                    </div>

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        error={!!errors.description}
                        helperText={errors.description}
                        required
                        className="bg-gray-800/50"
                    />

                    {errors.submit && (
                        <div className="text-red-500 text-sm mt-2">{errors.submit}</div>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="inherit"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : initialData ? "Update Club" : "Create Club"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ClubForm;