// src/hooks/usePlaces.js
import { useState, useEffect } from 'react';
import { useGoogleMaps } from './useGoogleMaps';

// Scoring algorithm constants
const MAX_DISTANCE = 5000; // 5km
const DISTANCE_WEIGHT = 0.5;
const RATING_WEIGHT = 0.3;
const RATING_COUNT_WEIGHT = 0.2;

function calculateScore(place, userLocation) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLocation.lat, userLocation.lng),
        place.geometry.location
    );

    // Normalize distance (closer is better)
    const distanceScore = 1 - Math.min(distance / MAX_DISTANCE, 1);

    // Normalize rating (higher is better)
    const ratingScore = place.rating ? place.rating / 5 : 0;

    // Normalize rating count (more ratings is better, max out at 1000 ratings)
    const ratingCountScore = Math.min((place.user_ratings_total || 0) / 1000, 1);

    // Calculate weighted score
    const score = (
        distanceScore * DISTANCE_WEIGHT +
        ratingScore * RATING_WEIGHT +
        ratingCountScore * RATING_COUNT_WEIGHT
    );

    return {
        ...place,
        distance,
        score
    };
}

export function usePlaces(location) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const googleMapsLoaded = useGoogleMaps();

    useEffect(() => {
        console.log('usePlaces effect running. Google Maps loaded:', googleMapsLoaded, 'Location:', location);
        if (!googleMapsLoaded || !location) return;

        console.log('Initiating place search');
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            location: new google.maps.LatLng(location.lat, location.lng),
            radius: MAX_DISTANCE,
            type: ['cafe']
        };

        service.nearbySearch(request, (results, status) => {
            console.log('Place search completed. Status:', status, 'Results:', results);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                if (results.length === 0) {
                    setError('No places found nearby');
                } else {
                    const scoredPlaces = results
                        .map(place => calculateScore(place, location))
                        .sort((a, b) => b.score - a.score); // Sort by score in descending order

                    console.log('Processed and scored places:', scoredPlaces);
                    setPlaces(scoredPlaces);
                    console.log('Places state updated:', scoredPlaces.length);
                }
            } else {
                setError(`Failed to fetch places: ${status}`);
            }
            setLoading(false);
        });
    }, [googleMapsLoaded, location]);

    return { places, loading, error };
}