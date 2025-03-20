import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const CouncilStats = ({ councilName }) => {
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch inventory data
    const fetchInventoryData = () => {
        axios.get(`${BASE_URL}/api/councils/${encodeURIComponent(councilName)}/inventory/`)
            .then((response) => {
                setInventory(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch inventory data", error);
                setError("Failed to load inventory data");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchInventoryData();
    }, [councilName]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">Inventory Details</h2>

            {loading ? (
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-blue-400 mt-4">Loading inventory...</p>
                </div>
            ) : error ? (
                <div className="bg-red-900 text-white p-4 rounded">
                    <p>{error}</p>
                </div>
            ) : inventory ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Budget Allocated */}
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h3 className="text-xl font-bold text-green-400">Budget Allocated</h3>
                        <p className="text-2xl font-semibold text-white mt-2">₹ {inventory.budget_allocated}</p>
                    </div>

                    {/* Budget Used */}
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h3 className="text-xl font-bold text-red-400">Budget Used</h3>
                        <p className="text-2xl font-semibold text-white mt-2">₹ {inventory.budget_used}</p>
                    </div>

                    {/* Remaining Budget */}
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h3 className="text-xl font-bold text-yellow-400">Remaining Budget</h3>
                        <p className="text-2xl font-semibold text-white mt-2">₹ {inventory.budget_allocated - inventory.budget_used}</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">No inventory details found for this council.</p>
            )}
        </div>
    );
};

export default CouncilStats;
