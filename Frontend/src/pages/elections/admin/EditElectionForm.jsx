import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:8000/api/";

const EditElectionForm = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}elections/${electionId}/`, { withCredentials: true })
      .then((response) => {
        // Remove the 'Z' (UTC) part and ensure the format is compatible with datetime-local
        const startDate = response.data.start_date.replace('Z', '').slice(0, 16);
        const endDate = response.data.end_date.replace('Z', '').slice(0, 16);

        setFormData({
          title: response.data.title,
          description: response.data.description,
          start_date: startDate,
          end_date: endDate,
        });
      })
      .catch(() => setError("Election not found."));

  }, [electionId]);

  console.log("Fetched Election:", formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError("End date must be after start date.");
      return;
    }
    try {
      await axios.put(`${API_URL}elections/${electionId}/`, formData);
      navigate("/admin/elections");
    } catch (error) {
      console.error("Error updating election:", error);
      setError("Failed to update election.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Edit Election</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          <textarea
            name="description"
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
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600"
          >
            Update Election
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditElectionForm;
