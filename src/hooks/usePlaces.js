// src/hooks/usePlaces.js
import { useState, useEffect } from 'react';
import { useGoogleMaps } from './useGoogleMaps';
import { calculateDistance } from '../utils/geoUtils';
import { getFromCache, setInCache } from '../utils/cache';

const API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

// Scoring algorithm constants
const MAX_DISTANCE = 5000; // 5km
const DISTANCE_WEIGHT = 0.5;
const RATING_WEIGHT = 0.3;
const RATING_COUNT_WEIGHT = 0.2;

function calculateScore(place, userLocation) {
    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.location.latitude,
        place.location.longitude
    );

    // Normalize distance (closer is better)
    const distanceScore = 1 - Math.min(distance / MAX_DISTANCE, 1);

    // Normalize rating (higher is better)
    const ratingScore = place.rating ? place.rating / 5 : 0;

    // Normalize rating count (more ratings is better, max out at 1000 ratings)
    const ratingCountScore = Math.min((place.userRatingCount || 0) / 1000, 1);

    // Calculate weighted score
    const score = (
        distanceScore * DISTANCE_WEIGHT +
        ratingScore * RATING_WEIGHT +
        ratingCountScore * RATING_COUNT_WEIGHT
    );

    return score;
}

export function usePlaces(location) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const googleMapsLoaded = useGoogleMaps();

    useEffect(() => {
        if (!location || !googleMapsLoaded) return;

        const fetchPlaces = async () => {
            const cacheKey = `places_${location.lat.toFixed(6)}_${location.lng.toFixed(6)}`;
            const cachedData = getFromCache(cacheKey);

            if (cachedData) {
                console.log('Cache hit: Using cached place data for', cacheKey);
                setPlaces(cachedData);
                setLoading(false);
                return;
            }

            console.log('Cache miss: Fetching new place data for', cacheKey);
            alert('Making API call to Google Places API'); // Add this line
            try {
                const response = await fetch(`https://places.googleapis.com/v1/places:searchNearby`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': API_KEY,
                        'X-Goog-FieldMask': '*'  // Request all available fields
                    },
                    body: JSON.stringify({
                        locationRestriction: {
                            circle: {
                                center: {
                                    latitude: location.lat,
                                    longitude: location.lng
                                },
                                radius: 5000.0
                            }
                        },
                        includedTypes: ["cafe"]
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch places');
                }

                const data = await response.json();
                
                console.log('Full API response:', data);

                const scoredPlaces = data.places.map(place => ({
                    ...place,
                    score: calculateScore(place, location),
                    distance: calculateDistance(
                        location.lat,
                        location.lng,
                        place.location.latitude,
                        place.location.longitude
                    )
                })).sort((a, b) => b.score - a.score);

                console.log('Fetched and processed places:', scoredPlaces);
                setPlaces(scoredPlaces);
                setInCache(cacheKey, scoredPlaces);
                console.log('Cached data for key:', cacheKey);
            } catch (err) {
                console.error('Error fetching places:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [location, googleMapsLoaded]);

    return { places, loading, error };
}

function getPlaceDetails(service, placeId) {
    return new Promise((resolve, reject) => {
        service.getDetails(
            { 
                placeId: placeId, 
                fields: [
                    'name', 
                    'rating', 
                    'user_ratings_total', 
                    'reviews', 
                    'geometry', 
                    'formatted_address', 
                    'photos'
                ] 
            },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place);
                } else {
                    reject(status);
                }
            }
        );
    });
}