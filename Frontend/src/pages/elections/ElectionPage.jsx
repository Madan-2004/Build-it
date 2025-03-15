import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api/";

const ElectionPage = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });

  useEffect(() => {
    axios
      .get(`${API_URL}elections/`)
      .then((response) => {
        const currentDate = new Date();
        const categorizedElections = {
          ongoing: [],
          upcoming: [],
          past: [],
        };

        response.data.forEach((election) => {
          const startDate = new Date(election.start_date);
          const endDate = new Date(election.end_date);
          election.start_date = election.start_date.slice(0, -1);
          election.end_date = election.end_date.slice(0, -1);

          if (currentDate >= startDate && currentDate <= endDate) {
            categorizedElections.ongoing.push(election);
          } else if (currentDate < startDate) {
            categorizedElections.upcoming.push(election);
          } else {
            categorizedElections.past.push(election);
          }
        });

        setElections(categorizedElections);
      })
      .catch((error) => {
        console.log("Error fetching elections: ", error);
      });
  }, []);
  return (
    <div className="bg-blue-200 p-10 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Elections</h1>

        {/* Ongoing Elections */}
        <h2 className="text-xl font-semibold mb-4">Ongoing Elections</h2>
        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-3 border">Election Name</th>
              <th className="p-3 border">Start Date&Time</th>
              <th className="p-3 border">End Date&Time</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {elections.ongoing.map((election) => (
              <tr
                key={election.id}
                className="hover:bg-blue-100 cursor-pointer"
              >
                <td className="p-3 border">{election.title}</td>
                <td className="p-3 border">{election.start_date}</td>
                <td className="p-3 border">{election.end_date}</td>
                <td className="p-3 border text-center">
                  <a
                    href="/vote.html"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Vote Now
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Upcoming Elections */}
        <h2 className="text-xl font-semibold mb-4">Upcoming Elections</h2>
        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="bg-green-200">
              <th className="p-3 border">Election Name</th>
              <th className="p-3 border">Start Date&Time</th>
              <th className="p-3 border">End Date&Time</th>
            </tr>
          </thead>
          <tbody>
            {elections.upcoming.map((election) => (
              <tr
                key={election.id}
                className="hover:bg-green-100 cursor-pointer"
              >
                <td className="p-3 border">{election.title}</td>
                <td className="p-3 border">{election.start_date}</td>
                <td className="p-3 border">{election.end_date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Past Elections */}
        <h2 className="text-xl font-semibold mb-4">Past Elections</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-200">
              <th className="p-3 border">Election Name</th>
              <th className="p-3 border">Start Date&Time</th>
              <th className="p-3 border">End Date&Time</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {elections.past.map((election) => (
              <tr key={election.id} className="hover:bg-red-100 cursor-pointer">
                <td className="p-3 border">{election.title}</td>
                <td className="p-3 border">{election.start_date}</td>
                <td className="p-3 border">{election.end_date}</td>
                <td className="p-3 border text-center">
                  <a
                    href="/electionresult.html"
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    See Results
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElectionPage;
