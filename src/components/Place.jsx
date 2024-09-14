import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import Fingerprint2 from 'fingerprintjs2';

export default function Place({ place }) {
  const [userScore, setUserScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSpeed, setWifiSpeed] = useState('');
  const [socketsAvailable, setSocketsAvailable] = useState(false);
  const [wifiUpdated, setWifiUpdated] = useState(null);
  const [databaseId, setDatabaseId] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  const [userVote, setUserVote] = useState(0);

  useEffect(() => {
    console.log('Place component received:', place);
    if (place) {
      fetchUserScore();
      extractCityAndCountry();
      fetchAdditionalInfo();
      getVisitorId();
    }
  }, [place]);

  useEffect(() => {
    if (visitorId && databaseId) {
      fetchUserVote();
    }
  }, [visitorId, databaseId]);

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

  const fetchAdditionalInfo = async () => {
    if (!place.geometry || !place.geometry.location) return;

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    try {
      const { data, error } = await supabase
        .from('Places')
        .select('id, wifi_password_val, wifi_speed, sockets_available, wifi_updated')
        .eq('latitude', latitude)
        .eq('longitude', longitude)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDatabaseId(data.id);
        setWifiPassword(data.wifi_password_val || '');
        setWifiSpeed(data.wifi_speed?.toString() || '');
        setSocketsAvailable(data.sockets_available || false);
        setWifiUpdated(data.wifi_updated || null);
      } else {
        // No existing data found
        setDatabaseId(null);
        setWifiPassword('');
        setWifiSpeed('');
        setSocketsAvailable(false);
        setWifiUpdated(null);
      }
    } catch (error) {
      console.error('Error fetching additional info:', error);
    }
  };

  const getVisitorId = async () => {
    let storedId = localStorage.getItem('visitorId');
    if (!storedId) {
      const components = await Fingerprint2.getPromise();
      const values = components.map(component => component.value);
      const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
      
      // Combine fingerprint with timestamp for added uniqueness
      const newId = `${fingerprint}-${Date.now()}`;
      localStorage.setItem('visitorId', newId);
      storedId = newId;
    }
    setVisitorId(storedId);
  };

  const fetchUserVote = async () => {
    try {
      const { data, error } = await supabase
        .from('Votes')
        .select('vote_type')
        .eq('place_id', databaseId)
        .eq('visitor_id', visitorId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setUserVote(data?.vote_type || 0);
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const updateUserScore = async (increment) => {
    if (!visitorId || !databaseId) {
      console.error('Visitor ID or Place ID not available');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling vote_and_update_score with:', { databaseId, visitorId, increment });
      const { data, error } = await supabase.rpc('vote_and_update_score', {
        p_place_id: databaseId,
        p_visitor_id: visitorId,
        p_vote_type: increment
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }

      console.log('vote_and_update_score response:', data);

      if (data && data.length > 0) {
        setUserScore(data[0].new_score);
        setUserVote(data[0].user_vote);
        console.log('Vote recorded successfully. New score:', data[0].new_score);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error updating user score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlace = async () => {
    if (!place.geometry || !place.geometry.location) {
      console.error('No valid coordinates for updatePlace');
      return;
    }

    setIsLoading(true);

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    try {
      const placeData = {
        name: place.name,
        address: place.formatted_address,
        latitude: latitude,
        longitude: longitude,
        city: city,
        country: country,
        wifi_password_val: wifiPassword,
        wifi_speed: parseInt(wifiSpeed) || null,
        sockets_available: socketsAvailable,
        wifi_updated: new Date().toISOString()
      };

      let result;
      if (databaseId) {
        // Update existing record
        result = await supabase
          .from('Places')
          .update(placeData)
          .eq('id', databaseId);
      } else {
        // Insert new record
        result = await supabase
          .from('Places')
          .insert(placeData)
          .select();

        if (result.data && result.data[0]) {
          setDatabaseId(result.data[0].id);
        }
      }

      if (result.error) throw result.error;
      console.log('Place updated successfully');
      fetchAdditionalInfo(); // Refresh the displayed data
    } catch (error) {
      console.error('Error updating place:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
              className={`bg-green-500 text-white px-2 py-1 rounded mr-2 ${userVote === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || userVote === 1}
            >
              Upvote
            </button>
            <button
              onClick={() => updateUserScore(-1)}
              className={`bg-red-500 text-white px-2 py-1 rounded ${userVote === -1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || userVote === -1}
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
        
        {/* WiFi Details */}
        {wifiPassword && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h4 className="text-lg font-semibold mb-2 text-blue-700">WiFi Details</h4>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Password:</span> {wifiPassword}
            </p>
            {wifiSpeed && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Speed:</span> {wifiSpeed} Mbps
              </p>
            )}
            <p className="text-sm text-gray-700">
              <span className="font-medium">Sockets Available:</span> {socketsAvailable ? 'Yes' : 'No'}
            </p>
            {wifiUpdated && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {formatDate(wifiUpdated)}
              </p>
            )}
          </div>
        )}

        {/* WiFi Input Fields */}
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Update WiFi Information</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">WiFi Password</label>
            <input
              type="text"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">WiFi Speed (Mbps)</label>
            <input
              type="number"
              value={wifiSpeed}
              onChange={(e) => setWifiSpeed(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={socketsAvailable}
                onChange={(e) => setSocketsAvailable(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Sockets Available</span>
            </label>
          </div>
          
          <button
            onClick={updatePlace}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Place Info'}
          </button>
        </div>
      </div>
    </div>
  );
}