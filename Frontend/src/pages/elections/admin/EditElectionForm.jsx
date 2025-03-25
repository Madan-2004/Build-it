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
    display_election: true, // Default true
    display_results: false, // Default false
  });
  const [voterFile, setVoterFile] = useState(null); // State for new voter file
  const [existingVoterFile, setExistingVoterFile] = useState(null); // State for existing voter file
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}elections/${electionId}/`, { withCredentials: true })
      .then((response) => {
        // Format datetime to match `datetime-local` input type
        const startDate = response.data.start_date.replace("Z", "").slice(0, 16);
        const endDate = response.data.end_date.replace("Z", "").slice(0, 16);
        console.log("titiiititit",response.data.voter_files[0]);
        
        setFormData({
          title: response.data.title,
          description: response.data.description,
          start_date: startDate,
          end_date: endDate,
          display_election: response.data.display_election,
          display_results: response.data.display_results,
        });
         // Set the existing voter file if available
         if (response.data.voter_files && response.data.voter_files.length > 0) {
          setExistingVoterFile(response.data.voter_files[0]); // Assuming one voter file per election
          
        }
      })
      .catch(() => setError("Election not found."));
  }, [electionId]);

  console.log("Fetched Election:", formData);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Handle checkboxes
    });
  };
  const handleFileChange = (e) => {
    setVoterFile(e.target.files[0]); // Set the new voter file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError("End date must be after start date.");
      return;
    }
    try {
      // Create a FormData object to handle file uploads
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);
      data.append("display_election", formData.display_election);
      data.append("display_results", formData.display_results);

      // Attach the new voter file if provided
      if (voterFile) {
        data.append("voter_file", voterFile);
      }
      await axios.put(`${API_URL}elections/${electionId}/`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      });
      navigate("/admin/elections");
    } catch (error) {
      console.error("Error updating election:", error);
      setError("Failed to update election.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Edit Election - {formData.title}
        </h1>


        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
            placeholder="Election Title"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            placeholder="Election Description"
          />

          {/* Start Date */}
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          {/* End Date */}
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          {/* Display Election Toggle */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="display_election"
              checked={formData.display_election}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Show Election to Users</span>
          </label>

          {/* Display Results Toggle */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="display_results"
              checked={formData.display_results}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Display Election Results</span>
          </label>

          {/* Existing Voter File */}
          {existingVoterFile && (
            <div className="bg-gray-100 p-3 rounded border">
              <p className="text-gray-700">
                Existing Voter File:{" "}
                <a
                  href={`http://localhost:8000${existingVoterFile.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download
                </a>
              </p>
            </div>
          )}

          {/* Upload New Voter File */}
          <input
            type="file"
            name="voter_file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full p-3 border rounded"
          />

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/elections")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Update Election
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditElectionForm;
