import LZString from 'lz-string';

const MAX_CACHE_SIZE = 4 * 1024 * 1024; // 4MB limit
const CACHE_EXPIRATION = 72 * 60 * 60 * 1000; // 72 hours

function getTotalCacheSize() {
  return Object.keys(localStorage).reduce((total, key) => {
    return total + localStorage.getItem(key).length;
  }, 0);
}

export function getFromCache(key) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsedData = JSON.parse(cached);
      if (parsedData && parsedData.value && parsedData.timestamp) {
        if (Date.now() - parsedData.timestamp < CACHE_EXPIRATION) {
          console.log('Cache hit for key:', key);
          return parsedData.value;
        } else {
          console.log('Cache expired for key:', key);
        }
      }
    }
  } catch (error) {
    console.error('Error retrieving from cache:', error);
  }
  console.log('Cache miss for key:', key);
  return null;
}

export function setInCache(key, value) {
  try {
    const data = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
    console.log('Data cached for key:', key);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

export function clearCache() {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('places_') || key.startsWith('place_details_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('Cache cleared');
}