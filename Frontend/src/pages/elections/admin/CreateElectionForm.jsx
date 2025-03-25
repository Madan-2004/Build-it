import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/auth";

const API_URL = "http://localhost:8000/";

const CreateElectionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [voterFile, setVoterFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setVoterFile(e.target.files[0]); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError("End date must be after start date.");
      return;
    }
    try {
      const userProfile = await authService.getUserProfile();
      console.log("profile:", userProfile);
      console.log("Creating election:", formData);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);
      data.append("display_results", false);  // Explicitly set true
      data.append("display_election", true);
      data.append("created_by", userProfile.id); // Explicitly include the user ID
      if (voterFile) {
        data.append("voter_file", voterFile); // Attach the voter file
      }
      const response = await axios.post(`${API_URL}api/elections/`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      });
      navigate("/admin/elections");
    } catch (error) {
      console.error("Error creating election:", error);
      setError("Failed to create election.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Create Election</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Election Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="file"
            name="voter_file "
            accept=".csv" // Restrict to CSV files
            onChange={handleFileChange}
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Create Election
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateElectionForm;
