import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Place({ place }) {
  const [userScore, setUserScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    console.log('Place component received:', place);
    if (place) {
      fetchUserScore();
      extractCityAndCountry();
    }
  }, [place]);

  const extractCityAndCountry = () => {
    console.log('Extracting city and country from:', place);
    if (place.address_components) {
      const cityComponent = place.address_components.find(
        component => component.types.includes('locality') || component.types.includes('administrative_area_level_1')
      );
      const countryComponent = place.address_components.find(
        component => component.types.includes('country')
      );

      setCity(cityComponent ? cityComponent.long_name : 'City not available');
      setCountry(countryComponent ? countryComponent.long_name : 'Country not available');
    } else if (place.formatted_address) {
      // Fallback: try to extract from formatted_address
      const addressParts = place.formatted_address.split(',');
      setCity(addressParts[addressParts.length - 2]?.trim() || 'City not available');
      setCountry(addressParts[addressParts.length - 1]?.trim() || 'Country not available');
    } else {
      console.log('No address components or formatted address found');
      setCity('City not available');
      setCountry('Country not available');
    }
  };

  const getCoordinates = () => {
    if (place.geometry && place.geometry.location) {
      if (typeof place.geometry.location.lat === 'function') {
        return {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        };
      } else if (typeof place.geometry.location.lat === 'number') {
        return {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        };
      }
    }
    console.error('Unable to extract coordinates from place object:', place);
    return null;
  };

  const coordinates = getCoordinates();

  const fetchUserScore = async () => {
    if (!coordinates) {
      console.error('No valid coordinates for fetchUserScore');
      return;
    }

    const { latitude, longitude } = coordinates;
    const precision = 0.0001; // Increased precision range

    try {
      const { data, error } = await supabase
        .from('Places')
        .select('user_score')
        .gte('latitude', latitude - precision)
        .lte('latitude', latitude + precision)
        .gte('longitude', longitude - precision)
        .lte('longitude', longitude + precision);

      if (error) {
        console.error('Error fetching user score:', error);
      } else if (data && data.length > 0) {
        setUserScore(data[0].user_score);
      } else {
        console.log('No existing score found for this location');
        setUserScore(0);
      }
    } catch (error) {
      console.error('Error in fetchUserScore:', error);
    }
  };

  const updateUserScore = async (increment) => {
    if (!coordinates) {
      console.error('No valid coordinates for updateUserScore');
      return;
    }

    setIsLoading(true);
    const newScore = (userScore || 0) + increment;

    try {
      const { data, error } = await supabase
        .from('Places')
        .upsert({ 
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          user_score: newScore,
          name: place.name,
          address: place.formatted_address,
          city: city,
          country: country
        }, { onConflict: ['latitude', 'longitude'] })
        .select('user_score')
        .single();

      if (error) {
        console.error('Error updating user score:', error);
      } else if (data) {
        setUserScore(data.user_score);
      }
    } catch (error) {
      console.error('Error in updateUserScore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Rendering place:', place);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {place.photos && place.photos.length > 0 ? (
        <img 
          src={place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })} 
          alt={place.name} 
          className="w-full h-48 object-cover" 
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
        <p className="text-gray-600 mb-2">{place.formatted_address || 'Address not available'}</p>
        <p className="text-sm text-gray-600 mb-1">City: {city}</p>
        <p className="text-sm text-gray-600 mb-2">Country: {country}</p>

        
        {place.formatted_phone_number && (
          <p className="text-sm text-gray-600 mb-2">Phone: {place.formatted_phone_number}</p>
        )}
        {place.website && (
          <p className="text-sm text-gray-600 mb-2">Website: <a href={place.website} target="_blank" rel="noopener noreferrer">{place.website}</a></p>
        )}
        {place.opening_hours && (
          <div className="mb-2">
            <p className="text-sm font-semibold">Opening Hours:</p>
            <ul className="text-sm text-gray-600">
              {place.opening_hours.weekday_text.map((day, index) => (
                <li key={index}>{day}</li>
              ))}
            </ul>
          </div>
        )}
        {place.price_level && (
          <p className="text-sm text-gray-600 mb-2">Price Level: {'$'.repeat(place.price_level)}</p>
        )}
        {coordinates && (
          <p className="text-sm text-gray-600 mb-2">
            Coordinates: {coordinates.latitude}, {coordinates.longitude}
          </p>
        )}
        
        {place.distance && (
          <p className="text-sm text-gray-500 mb-2">Distance: {(place.distance / 1000).toFixed(2)} km</p>
        )}
        {userScore !== undefined && (
          <div className="flex items-center mb-2">
            <p className="text-sm text-gray-500 mr-2">User Score: {userScore?.toFixed(1) || 'N/A'}</p>
            <button
              onClick={() => updateUserScore(1)}
              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              disabled={isLoading}
            >
              Upvote
            </button>
            <button
              onClick={() => updateUserScore(-1)}
              className="bg-red-500 text-white px-2 py-1 rounded"
              disabled={isLoading}
            >
              Downvote
            </button>
          </div>
        )}
        {place.types && place.types.length > 0 && (
          <p className="text-sm text-gray-500 mb-2">Types: {place.types.join(', ')}</p>
        )}
        <h3>Reviews:</h3>
        <ul>
            {place.reviews && place.reviews.map((review, index) => (
                <li key={index}>
                    <p>{review.text}</p>
                    <p>Rating: {review.rating} / 5</p>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}