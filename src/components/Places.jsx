import React, { useState, useEffect, useMemo } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import Place from './Place';
import FilterBar from './FilterBar';

export default function Places() {
  const [userLocation, setUserLocation] = useState(null);
  const [fallbackLocation, setFallbackLocation] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { places, loading, error } = usePlaces(userLocation || fallbackLocation);
  const [filters, setFilters] = useState({ name: '', rating: '', distance: '' });

  useEffect(() => {
    console.log('Attempting to get user location');
    let geolocationTimeout;

    if (navigator.geolocation) {
      geolocationTimeout = setTimeout(() => {
        console.log('Geolocation timed out, using fallback');
        getFallbackLocation();
      }, 5000); // 5 second timeout

      navigator.geolocation.getCurrentPosition(
        position => {
          clearTimeout(geolocationTimeout);
          console.log('User location obtained:', position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          clearTimeout(geolocationTimeout);
          console.error("Error: The Geolocation service failed.", error);
          getFallbackLocation();
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
      getFallbackLocation();
    }

    return () => clearTimeout(geolocationTimeout);
  }, []);

  const getFallbackLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log('Fallback location obtained:', data);
      setFallbackLocation({
        lat: data.latitude,
        lng: data.longitude
      });
      setIsUsingFallback(true);
    } catch (error) {
      console.error('Error getting fallback location:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const nameMatch = place.name.toLowerCase().includes(filters.name.toLowerCase());
      const ratingMatch = filters.rating ? place.rating >= parseFloat(filters.rating) : true;
      const distanceMatch = filters.distance ? place.distance <= parseFloat(filters.distance) : true;
      return nameMatch && ratingMatch && distanceMatch;
    });
  }, [places, filters]);

  if (!userLocation && !fallbackLocation) return <p>Obtaining your location...</p>;
  if (loading) return <p>Loading places...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {isUsingFallback && (
        <p className="text-yellow-600 mb-4">
          Using approximate location. Enable geolocation for more accurate results.
        </p>
      )}
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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