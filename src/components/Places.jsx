import React, { useState, useEffect, useMemo } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import Place from './Place';
import FilterBar from './FilterBar';
import { clearCache } from '../utils/cache';  // Add this import

const ALLOWED_TYPES = [
  'art_gallery',
  'cafe',
  'library',
  'museum',
  'hotel',
  'coffee_shop',
  'performing_arts_theater'
];

export default function Places() {
  const [userLocation, setUserLocation] = useState(null);
  const { places, loading, error } = usePlaces(userLocation);
  const [filters, setFilters] = useState({ name: '', rating: '', distance: '' });

  useEffect(() => {
    console.log('Attempting to get user location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('User location obtained:', position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error: The Geolocation service failed.", error);
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  useEffect(() => {
    console.log('Places received from usePlaces:', places);
  }, [places]);

  const handleFilterChange = (filterType, value) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [filterType]: value };
      console.log('New filters:', newFilters);
      return newFilters;
    });
  };

  const filteredPlaces = useMemo(() => {
    console.log('Filtering places with filters:', filters);
    return places.filter(place => {
      const nameMatch = place.displayName.text.toLowerCase().includes(filters.name.toLowerCase());
      const ratingMatch = filters.rating ? place.rating >= parseFloat(filters.rating) : true;
      const distanceMatch = filters.distance ? place.distance <= parseFloat(filters.distance) : true;
      const typeMatch = ALLOWED_TYPES.includes(place.primaryType);
      return nameMatch && ratingMatch && distanceMatch && typeMatch;
    });
  }, [places, filters]);

  console.log('Places component rendering. All Places:', places.length, 'Filtered Places:', filteredPlaces.length);

  const handleClearCache = () => {
    clearCache();
    console.log('Cache cleared');
    // Optionally, you might want to trigger a re-fetch of places here
    // This depends on how your usePlaces hook is implemented
  };

  if (!userLocation) return <p>Obtaining your location...</p>;
  if (loading) return <p>Loading places...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={handleClearCache}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Places Cache
        </button>
      )}
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p>Loading places...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && places.length > 0 && filteredPlaces.length === 0 && <p>No places match the current filters.</p>}
        {!loading && !error && places.length === 0 && <p>No places found.</p>}
        {filteredPlaces.map(place => (
          <Place key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}