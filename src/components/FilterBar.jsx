import React from 'react';

export default function FilterBar({ onFilterChange }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Filter by name..."
        onChange={(e) => onFilterChange('name', e.target.value)}
        className="p-2 border rounded mr-2"
      />
      <select
        onChange={(e) => onFilterChange('rating', e.target.value)}
        className="p-2 border rounded mr-2"
      >
        <option value="">All Ratings</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
        <option value="2">2+ Stars</option>
      </select>
      <select
        onChange={(e) => onFilterChange('distance', e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Any Distance</option>
        <option value="1000">Within 1 km</option>
        <option value="2000">Within 2 km</option>
        <option value="5000">Within 5 km</option>
      </select>
    </div>
  );
}