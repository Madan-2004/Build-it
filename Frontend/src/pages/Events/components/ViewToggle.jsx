import React from "react";
import { Grid, List } from "react-feather";

export default function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center space-x-2 bg-[#ffffff] rounded-lg p-1 border border-[#ddd]">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 rounded ${
          viewMode === "grid"
            ? "bg-[#007BFF] text-[#ffffff]"
            : "text-gray-600 hover:text-[#002147]"
        }`}
      >
        <Grid className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-2 rounded ${
          viewMode === "list"
            ? "bg-[#007BFF] text-[#ffffff]"
            : "text-gray-600 hover:text-[#002147]"
        }`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}
