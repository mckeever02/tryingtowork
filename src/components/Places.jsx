import React, { useState, useEffect, useMemo } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import Place from './Place';
import FilterBar from './FilterBar';

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
      const nameMatch = place.name.toLowerCase().includes(filters.name.toLowerCase());
      const ratingMatch = filters.rating ? place.rating >= parseFloat(filters.rating) : true;
      const distanceMatch = filters.distance ? place.distance <= parseFloat(filters.distance) : true;
      return nameMatch && ratingMatch && distanceMatch;
    });
  }, [places, filters]);

  console.log('Places component rendering. All Places:', places.length, 'Filtered Places:', filteredPlaces.length);

  if (!userLocation) return <p>Obtaining your location...</p>;
  if (loading) return <p>Loading places...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <Place key={place.place_id} place={place} />
          ))
        ) : (
          <p>No places found matching your filters. Try adjusting your criteria.</p>
        )}
      </div>
    </div>
  );
}