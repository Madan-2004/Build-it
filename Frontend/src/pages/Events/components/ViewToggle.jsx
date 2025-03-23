import React from 'react';
import { Grid, List } from 'react-feather';

export default function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded ${
          viewMode === 'grid' 
            ? 'bg-white shadow text-blue-600' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded ${
          viewMode === 'list' 
            ? 'bg-white shadow text-blue-600' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}