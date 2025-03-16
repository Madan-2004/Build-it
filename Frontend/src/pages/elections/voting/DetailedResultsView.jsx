import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const API_URL = "http://localhost:8000/api/";

const DetailedResultsView = () => {
  const { electionId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}elections/${electionId}/results/`)
      .then((response) => {
        setResults(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setLoading(false);
      });
  }, [electionId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading results...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Election Results
        </h1>

        {results?.positions?.map((position) => (
          <div key={position.id} className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              {position.title} ({position.total_votes} total votes)
            </h2>

            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-blue-200">
                  <th className="p-3 border">Candidate Name</th>
                  <th className="p-3 border">Degree</th>
                  <th className="p-3 border">Roll No</th>
                  <th className="p-3 border">branch</th>
                  <th className="p-3 border">Votes</th>
                </tr>
              </thead>
              <tbody>
                {position.candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-blue-100">
                    <td className="p-3 border">{candidate.name}</td>
                    <td className="p-3 border">{candidate.degree}</td>
                    <td className="p-3 border">{candidate.roll_no}</td>
                    <td className="p-3 border">{candidate.branch}</td>
                    <td className="p-3 border text-center">
                      {candidate.votes_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Chart Visualization */}
            <Bar
              data={{
                labels: position.candidates.map((c) => c.name),
                datasets: [
                  {
                    label: "Votes",
                    data: position.candidates.map((c) => c.votes_count),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedResultsView;
