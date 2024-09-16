const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const getFromCache = (key) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { value, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return value;
    }
  }
  return null;
};

export const setInCache = (key, value) => {
  const data = {
    value,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(data));
};