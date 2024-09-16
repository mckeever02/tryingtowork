import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import Fingerprint2 from 'fingerprintjs2';
import { getFromCache, setInCache } from '../utils/cache';

const GOOGLE_MAPS_API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

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
  const [placeId, setPlaceId] = useState(null);

  useEffect(() => {
    console.log('Place component received:', place);
    if (place) {
      setPlaceId(place.id);
      fetchUserScore();
      extractCityAndCountry();
      fetchAdditionalInfo();
      getVisitorId();
      fetchPlaceDetails();
    }
  }, [place]);

  useEffect(() => {
    console.log('visitorId:', visitorId, 'databaseId:', databaseId);
    if (visitorId && databaseId) {
      fetchUserVote();
    }
  }, [visitorId, databaseId]);

  const extractCityAndCountry = () => {
    let extractedCity = '';
    let extractedCountry = '';

    // Extract city and country from formattedAddress
    if (place.formattedAddress) {
      const addressParts = place.formattedAddress.split(',');
      extractedCity = addressParts[addressParts.length - 2]?.trim() || '';
      extractedCountry = addressParts[addressParts.length - 1]?.trim() || '';
    }

    setCity(extractedCity);
    setCountry(extractedCountry);
  };

  const getCoordinates = () => {
    if (place.location) {
      return {
        latitude: place.location.latitude,
        longitude: place.location.longitude
      };
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
    if (!coordinates) return;

    const { latitude, longitude } = coordinates;

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
        console.log('Set databaseId:', data.id);
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

  const fetchOrCreatePlace = async () => {
    if (!placeId) {
      console.error('Place ID not available');
      return null;
    }

    try {
      let { data, error } = await supabase
        .from('Places')
        .select('id, user_score')
        .eq('place_id', placeId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const newPlace = {
          place_id: placeId,
          name: place.displayName?.text,
          address: place.shortFormattedAddress,
          latitude: place.location?.latitude,
          longitude: place.location?.longitude,
          user_score: 0
        };

        const { data: insertedPlace, error: insertError } = await supabase
          .from('Places')
          .insert(newPlace)
          .select()
          .single();

        if (insertError) throw insertError;

        data = insertedPlace;
      }

      setDatabaseId(data.id);
      setUserScore(data.user_score || 0);

      return data.id;
    } catch (error) {
      console.error('Error fetching or creating place:', error);
      return null;
    }
  };

  const fetchUserVote = async (fetchedDatabaseId) => {
    if (!visitorId || !fetchedDatabaseId) {
      console.log('Visitor ID or Database ID not available yet');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Votes')
        .select('vote_type')
        .eq('place_id', fetchedDatabaseId)
        .eq('visitor_id', visitorId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No existing vote found for this place and visitor');
          setUserVote(0);
        } else {
          throw error;
        }
      } else {
        setUserVote(data?.vote_type || 0);
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
      setUserVote(0);
    }
  };

  const updateUserScore = async (increment) => {
    if (!visitorId) {
      console.error('Visitor ID not available');
      return;
    }

    setIsLoading(true);
    try {
      const fetchedDatabaseId = await fetchOrCreatePlace();

      if (!fetchedDatabaseId) {
        throw new Error('Failed to create or fetch place record');
      }

      console.log('Current score:', userScore);
      console.log('Current user vote:', userVote);
      console.log('Attempting to vote:', increment);

      const { data, error } = await supabase.rpc('vote_and_update_score', {
        p_place_id: fetchedDatabaseId,
        p_visitor_id: visitorId,
        p_vote_type: increment
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }

      console.log('vote_and_update_score response:', data);

      if (data && data.length > 0) {
        console.log('New score:', data[0].new_score);
        console.log('New user vote:', data[0].user_vote);
        console.log('Score change:', data[0].new_score - userScore);
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
    if (!coordinates) {
      console.error('No valid coordinates for updatePlace');
      return;
    }

    setIsLoading(true);

    try {
      const placeData = {
        name: place.displayName.text,
        address: place.shortFormattedAddress,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
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

  const getPhotoUrl = (photoName) => {
    return `https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_MAPS_API_KEY}&maxHeightPx=800&maxWidthPx=1200`;
  };

  const fetchPlaceDetails = async () => {
    if (!place.id) return;

    const cacheKey = `place_details_${place.id}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log('Using cached data for place:', place.id);
      updatePlaceState(cachedData);
      return;
    }

    console.log('Cache miss for place details:', place.id);
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use the place data we already have instead of fetching
      const data = {
        id: place.id,
        displayName: place.displayName,
        formattedAddress: place.formattedAddress,
        location: place.location,
        types: place.types,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        photos: place.photos
      };

      // Cache the data
      setInCache(cacheKey, data);

      // Update component state with fetched data
      updatePlaceState(data);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const updatePlaceState = (data) => {
    // Update component state with place details
    // This function will update all relevant state variables with the fetched or cached data
    setCity(extractCity(data.formattedAddress));
    setCountry(extractCountry(data.addressComponents));
    // ... update other state variables as needed
  };

  const extractCity = (address) => {
    if (!address) return '';
    const addressParts = address.split(',');
    return addressParts[addressParts.length - 2]?.trim() || '';
  };

  const extractCountry = (addressComponents) => {
    if (!addressComponents) return '';
    const countryComponent = addressComponents.find(
      component => component.types.includes('country')
    );
    return countryComponent ? countryComponent.longText : '';
  };

  console.log('Rendering place:', place);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {place.photos && place.photos.length > 0 ? (
        <img 
          src={getPhotoUrl(place.photos[0].name)}
          alt={place.displayName?.text} 
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{place.displayName?.text}</h3>
        <p className="text-gray-600 mb-1">{place.formattedAddress}</p>
        {(city || country) && (
          <p className="text-sm text-gray-500 mb-2">
            {city && country ? `${city}, ${country}` : city || country}
          </p>
        )}
        <p className="text-sm text-gray-600 mb-1">Types: {place.types?.join(', ')}</p>
        {place.rating && (
          <p className="text-sm text-gray-600 mb-2">
            Rating: {place.rating} ({place.userRatingCount} reviews)
          </p>
        )}
        {place.distance && (
          <p className="text-sm text-gray-600 mb-2">
            Distance: {(place.distance / 1000).toFixed(2)} km
          </p>
        )}
        {place.score && (
          <p className="text-sm text-gray-600 mb-2">
            Score: {place.score.toFixed(2)}
          </p>
        )}
        
        {/* Voting buttons */}
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => updateUserScore(1)}
            disabled={isLoading || userVote === 1}
            className={`px-4 py-2 rounded ${
              userVote === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-400'}`}
          >
            Upvote
          </button>
          <button
            onClick={() => updateUserScore(-1)}
            disabled={isLoading || userVote === -1}
            className={`px-4 py-2 rounded ${
              userVote === -1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-400'}`}
          >
            Downvote
          </button>
        </div>

        {/* User Score */}
        <p className="text-center mt-2">
          User Score: {userScore}
        </p>

        {/* WiFi Information */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">WiFi Information:</h4>
          <p className="text-sm text-gray-600 mb-1">WiFi Password: {wifiPassword || 'Not available'}</p>
          <p className="text-sm text-gray-600 mb-1">WiFi Speed: {wifiSpeed ? `${wifiSpeed} Mbps` : 'Not available'}</p>
          <p className="text-sm text-gray-600 mb-1">Sockets Available: {socketsAvailable ? 'Yes' : 'No'}</p>
          <p className="text-sm text-gray-600 mb-1">Last Updated: {formatDate(wifiUpdated)}</p>
        </div>

        {/* WiFi Update Form */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Update WiFi Information:</h4>
          <form onSubmit={(e) => { e.preventDefault(); updatePlace(); }}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">WiFi Password</label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">WiFi Speed (Mbps)</label>
              <input
                type="number"
                value={wifiSpeed}
                onChange={(e) => setWifiSpeed(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={socketsAvailable}
                  onChange={(e) => setSocketsAvailable(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                Sockets Available
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Updating...' : 'Update WiFi Info'}
            </button>
          </form>
        </div>

        {/* New elements for additional data */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Additional Information:</h4>
          <p className="text-sm text-gray-600 mb-1">ID: {place.id}</p>
          {place.primaryType && (
            <p className="text-sm text-gray-600 mb-1">Primary Type: {place.primaryType}</p>
          )}
          {place.primaryTypeDisplayName && (
            <p className="text-sm text-gray-600 mb-1">Primary Type Display Name: {place.primaryTypeDisplayName.text}</p>
          )}
          {place.editorialSummary && (
            <p className="text-sm text-gray-600 mb-2">Editorial Summary: {place.editorialSummary.text}</p>
          )}
          <p className="text-sm text-gray-600 mb-1">Place Types: {place.types?.join(', ')}</p>
          {coordinates && (
            <p className="text-sm text-gray-600 mb-1">
              Coordinates: {coordinates.latitude}, {coordinates.longitude}
            </p>
          )}
          {place.plusCode && (
            <p className="text-sm text-gray-600 mb-1">Plus Code: {place.plusCode.globalCode}</p>
          )}
          {place.businessStatus && (
            <p className="text-sm text-gray-600 mb-1">Business Status: {place.businessStatus}</p>
          )}
          {place.nationalPhoneNumber && (
            <p className="text-sm text-gray-600 mb-1">Phone: {place.nationalPhoneNumber}</p>
          )}
          {place.websiteUri && (
            <p className="text-sm text-gray-600 mb-1">Website: <a href={place.websiteUri} target="_blank" rel="noopener noreferrer">{place.websiteUri}</a></p>
          )}
          {place.regularOpeningHours && (
            <div className="text-sm text-gray-600 mb-1">
              <p>Opening Hours:</p>
              <ul className="list-disc list-inside pl-4">
                {place.regularOpeningHours.weekdayDescriptions.map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            </div>
          )}
          {place.accessibilityOptions && (
            <div className="text-sm text-gray-600 mb-1">
              <p>Accessibility Options:</p>
              <ul className="list-disc list-inside pl-4">
                {Object.entries(place.accessibilityOptions).map(([key, value]) => (
                  <li key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}: {value ? 'Yes' : 'No'}</li>
                ))}
              </ul>
            </div>
          )}
          {place.parkingOptions && (
            <div className="text-sm text-gray-600 mb-1">
              <p>Parking Options:</p>
              <ul className="list-disc list-inside pl-4">
                {Object.entries(place.parkingOptions).map(([key, value]) => (
                  <li key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}: {value ? 'Yes' : 'No'}</li>
                ))}
              </ul>
            </div>
          )}
          {place.paymentOptions && (
            <div className="text-sm text-gray-600 mb-1">
              <p>Payment Options:</p>
              <ul className="list-disc list-inside pl-4">
                {Object.entries(place.paymentOptions).map(([key, value]) => (
                  <li key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}: {value ? 'Yes' : 'No'}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}