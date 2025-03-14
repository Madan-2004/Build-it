import React from 'react';

const ElectionTable = ({ title, elections, handleAction }) => {
  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Election ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Election Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {elections.map((election) => (
            <tr key={election.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700 border-t border-b border-gray-300">{election.id}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-t border-b border-gray-300">{election.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-t border-b border-gray-300">{election.date}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-t border-b border-gray-300">
                <button
                  onClick={() => handleAction(election)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  {election.status === 'past' ? 'View Results' : 'Vote Now'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectionTable;
