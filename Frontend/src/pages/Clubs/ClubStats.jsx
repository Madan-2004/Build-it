import React, { useState, useEffect } from "react";
import clsx from "clsx";  // Install using: npm install clsx
const API_BASE_URL = "http://localhost:8000";

const ClubStats = ({ club, darkMode }) => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!club?.name) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/clubs/${club.name}/inventory/`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setInventory(data[0] || {});  // Access the first inventory item
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        setError("Failed to fetch inventory data");
        setLoading(false);
      }
    };

    fetchInventory();
  }, [club?.name]);

  if (loading) {
    return <div className="text-center p-6 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className={clsx(darkMode ? "bg-gray-800" : "bg-white", "rounded-xl shadow-xl overflow-hidden")}>
      {/* Header */}
      <div className={clsx("px-6 py-4", darkMode ? "bg-gradient-to-r from-blue-800 to-indigo-900" : "bg-gradient-to-r from-blue-500 to-indigo-500")}>
        <h2 className="text-xl font-bold text-white flex items-center">
          📊 Club Stats
        </h2>
      </div>

      {/* Club Statistics */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
            <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Members</p>
            <p className={clsx("text-3xl font-bold", darkMode ? "text-blue-400" : "text-blue-600")}>
              {club?.members?.length || 0}
            </p>
          </div>
          <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
            <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Founded</p>
            <p className={clsx("text-xl font-bold", darkMode ? "text-blue-400" : "text-blue-600")}>
              {club?.founded || "N/A"}
            </p>
          </div>
        </div>

        {/* Inventory Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">📦 Inventory Details</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
              <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Budget Allocated</p>
              <p className={clsx("text-xl font-bold", darkMode ? "text-green-400" : "text-green-600")}>
                ₹ {inventory?.budget_allocated || 0}
              </p>
            </div>
            <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center")}>
              <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Budget Used</p>
              <p className={clsx("text-xl font-bold", darkMode ? "text-red-400" : "text-red-600")}>
                ₹ {inventory?.budget_used || 0}
              </p>
            </div>
            <div className={clsx(darkMode ? "bg-gray-700" : "bg-gray-100", "p-4 rounded-lg text-center col-span-2")}>
              <p className={clsx(darkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>Remaining Budget</p>
              <p className={clsx("text-xl font-bold", darkMode ? "text-yellow-400" : "text-yellow-600")}>
                ₹ {(inventory?.budget_allocated || 0) - (inventory?.budget_used || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubStats;
