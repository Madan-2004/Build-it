import { formatDate } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'react-feather';

export default function EventForm({ onSubmit, onClose, initialData = null, isClubLocked = false}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    image: null,
    pdf: null,
    status: 'draft',
    club_name: '',
    category: '',
    register_link: '',
    fees: 'Free Entry',
    contact: 'info@iitindore.ac.in',
    ...initialData,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'image' && key !== 'pdf') {
          formDataToSend.append(key, formData[key] || '');
        }
      });

      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.pdf instanceof File) {
        formDataToSend.append('pdf', formData.pdf);
      }

      await onSubmit(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (name === 'pdf' && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, pdf: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-[#002c59] text-white rounded-t-lg">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white hover:text-[#002c59] rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Title', name: 'title', type: 'text' },
              { label: 'Location', name: 'location', type: 'text' },
              { label: 'Start Date', name: 'start_date', type: 'datetime-local' },
              { label: 'End Date', name: 'end_date', type: 'datetime-local' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#002c59] focus:ring-[#002c59]"
                />
              </div>
            ))}
            {/* Club Name Field (Locked if isClubLocked is true) */}
            {formData.club_name && <div>
              <label className="block text-sm font-medium text-gray-700">Club Name</label>
              <input
                type="text"
                name="club_name"
                value={formData.club_name || ""} // Ensure it's never undefined
                disabled // Ensure it's always a boolean
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>}
            {[
              { label: 'Fees', name: 'fees', type: 'text' },
              { label: 'Register Link', name: 'register_link', type: 'url' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#002c59] focus:ring-[#002c59]"
                />
              </div>
            ))}
            

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#002c59] focus:ring-[#002c59]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#002c59] focus:ring-[#002c59]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="mt-2 flex items-center space-x-4">
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                ref={fileInputRef}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {imagePreview && (
                <div className="relative w-24 h-24">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">PDF</label>
            <input
              type="file"
              name="pdf"
              onChange={handleChange}
              accept="application/pdf"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#002c59] focus:ring-[#002c59]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#002c59] text-white rounded-lg hover:bg-[#004080]"
            >
              {initialData ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
