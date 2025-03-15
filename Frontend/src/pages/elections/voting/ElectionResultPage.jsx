import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const API_URL = "http://localhost:8000/api/";

const ElectionResultPage = () => {
  const { electionId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}elections/${electionId}/results/`)
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching election results:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [electionId]);

  if (loading) {
    return <div className="text-center mt-10">Loading results...</div>;
  }

  if (!results) {
    return <div className="text-center mt-10">No results available.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">{results.title} - Results</h1>

        {results.positions.map((position) => (
          <div key={position.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">{position.title}</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Candidate</th>
                    <th className="p-3 border">Votes</th>
                    <th className="p-3 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {position.candidates.map((candidate, index) => (
                    <tr key={candidate.id} className="hover:bg-gray-100">
                      <td className="p-3 border">{candidate.name}</td>
                      <td className="p-3 border">{candidate.votes_count}</td>
                      <td className="p-3 border font-semibold">
                        {index === 0 ? "🏆 Winner" : "Runner-up"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart for visualization */}
            <div className="mt-4">
              <Bar
                data={{
                  labels: position.candidates.map((c) => c.name),
                  datasets: [
                    {
                      label: "Votes",
                      data: position.candidates.map((c) => c.votes_count),
                      backgroundColor: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"],
                    },
                  ],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionResultPage;
