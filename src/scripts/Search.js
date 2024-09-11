import { createRoot } from 'react-dom/client';
import Place from '../components/Place.jsx';

const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

let userLocation;
let allPlaces = [];

export function initSearch() {
  // This function can be used to initialize any global search settings or listeners
  console.log('Search functionality initialized');
}

// You can add other utility functions here if needed, for example:

export function formatDistance(meters) {
  return (meters / 1000).toFixed(2) + ' km';
}

export function calculateScore(place, distance) {
  const ratingWeight = 0.4;
  const distanceWeight = 0.6;
  const maxDistance = 5000; // 5km

  const ratingScore = place.rating ? (place.rating / 5) : 0;
  const distanceScore = 1 - (distance / maxDistance);

  return (ratingScore * ratingWeight) + (distanceScore * distanceWeight);
}

// Add any other utility functions that might be used across different components