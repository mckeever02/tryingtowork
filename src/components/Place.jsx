import React from 'react';

export default function Place({ place }) {
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
        <p className="text-gray-600 mb-2">{place.vicinity || 'Address not available'}</p>
        {place.rating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-1">{'★'.repeat(Math.round(place.rating))}</span>
            <span className="text-gray-600">{place.rating.toFixed(1)}</span>
            {place.user_ratings_total && (
              <span className="text-gray-400 ml-1">({place.user_ratings_total} reviews)</span>
            )}
          </div>
        )}
        {place.distance && (
          <p className="text-sm text-gray-500 mb-2">Distance: {(place.distance / 1000).toFixed(2)} km</p>
        )}
        {place.score !== undefined && (
          <p className="text-sm text-gray-500 mb-2">Score: {place.score.toFixed(3)}</p>
        )}
        {place.types && place.types.length > 0 && (
          <p className="text-sm text-gray-500 mb-2">Types: {place.types.join(', ')}</p>
        )}
      </div>
    </div>
  );
}