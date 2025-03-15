import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const EligibilityCheck = () => {
  const { electionId } = useParams();
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const userResponse = await axios.get(`${API_URL}userprofiles/me/`);
        setUserProfile(userResponse.data);

        const response = await axios.get(`${API_URL}elections/${electionId}/eligibility/`);
        setEligibility(response.data);
      } catch (error) {
        console.error("Error fetching eligibility:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [electionId]);

  if (loading) {
    return <p className="text-center text-gray-500">Checking eligibility...</p>;
  }

  if (!userProfile || !eligibility) {
    return <p className="text-center text-red-500">Error loading eligibility data.</p>;
  }

  const { batch, degree, department } = userProfile;
  const isEligible =
    (!eligibility.batch || eligibility.batch.includes(batch)) &&
    (!eligibility.degree || eligibility.degree.includes(degree)) &&
    (!eligibility.department || eligibility.department.includes(department));

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Voting Eligibility</h1>
        {isEligible ? (
          <p className="text-green-600 text-lg font-semibold">
            ✅ You are eligible to vote in this election.
          </p>
        ) : (
          <p className="text-red-600 text-lg font-semibold">
            ❌ You are not eligible to vote in this election.
          </p>
        )}
      </div>
    </div>
  );
};

export default EligibilityCheck;
