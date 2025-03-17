import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:8000/api/";

const CandidateForm = () => {
  const { electionId, positionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    degree: "BTech",
    roll_number: "",
    department: "CSE",
    photo: null,
    approved: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Candidate must have a name.");
      return;
    }

    const candidateData = new FormData();
    candidateData.append("position", positionId);
    candidateData.append("name", formData.name);
    candidateData.append("degree", formData.degree);
    candidateData.append("roll_no", formData.roll_number);
    candidateData.append("branch", formData.department);
    if (formData.photo) {
      candidateData.append("photo", formData.photo);
  }
    candidateData.append("approved", formData.approved);

    try {
      // ✅ Log form data before sending
      for (let [key, value] of candidateData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await axios.post(
        `${API_URL}elections/${electionId}/positions/${positionId}/candidates/`,
        candidateData,
        { withCredentials: true }
      );
  
      // ✅ Show success notification
      toast.success("Candidate added successfully!", { position: "top-right", autoClose: 5000 });
  
      // ✅ Navigate to candidates list
      navigate(`/admin/elections/${electionId}/positions/${positionId}/candidates/`);
    } catch (error) {
      console.error("Error adding candidate:", error);
  
      // ✅ Extract backend error message
      const errorMessage = error.response?.data?.[0] || "Failed to add candidate.";
  
      // ✅ Show error notification
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Add Candidate</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-semibold">Candidate Name</label>
          <input
            type="text"
            name="name"
            placeholder="Candidate Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          <label className="block font-semibold">Degree</label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            <option value="BTech">BTech</option>
            <option value="MTech">MTech</option>
            <option value="PhD">PhD</option>
          </select>

          <label className="block font-semibold">Roll Number</label>
          <input
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            value={formData.roll_number}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <label className="block font-semibold">Department</label>
          <input
            type="text"
            name="department"
            placeholder="Department (e.g., CSE, ECE)"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <label className="block font-semibold">Upload Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="approved"
              checked={formData.approved}
              onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
              className="w-5 h-5"
            />
            <span>Approve Candidate</span>
          </label>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600"
          >
            Add Candidate
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
