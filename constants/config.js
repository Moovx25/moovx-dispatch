export const CONFIG = {
  TOMTOM_API_KEY: '7wjmlJ32cE1FKkAlTpAtCcIUiNRxA7Kc', // This key might be invalid
  DEFAULT_LOCATION: {
    latitude: 6.5244,
    longitude: 3.3792, // Lagos, Nigeria
  },
  MAP_SETTINGS: {
    DEFAULT_ZOOM: 13,
    LOCATION_TIMEOUT: 15000,
    WATCH_INTERVAL: 5000,
    DISTANCE_INTERVAL: 5,
  },
};

// Test API key validity immediately
export const testTomTomAPI = async () => {
  try {
    console.log('Testing TomTom API key:', CONFIG.TOMTOM_API_KEY.substring(0, 8) + '...');
    const response = await fetch(`https://api.tomtom.com/search/2/geocode/Lagos.json?key=${CONFIG.TOMTOM_API_KEY}`);
    const data = await response.json();
    
    if (response.status === 200) {
      console.log('✅ TomTom API key is VALID');
      return true;
    } else {
      console.error('❌ TomTom API key INVALID - Status:', response.status);
      console.error('Error details:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ TomTom API test failed:', error);
    return false;
  }
};


