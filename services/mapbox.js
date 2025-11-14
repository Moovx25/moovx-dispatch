// services/mapbox.js
import Constants from 'expo-constants';
import axios from 'axios';

const MAPBOX_API_KEY = Constants.manifest.extra.mapboxApiKey;
const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

/**
 * Get route coordinates between two points
 * @param {Array} start [longitude, latitude]
 * @param {Array} end [longitude, latitude]
 * @returns Array of [lng, lat] coordinates for Polyline
 */
export const getRoute = async (start, end) => {
  try {
    const url = `${BASE_URL}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;
    const response = await axios.get(url);
    const route = response.data.routes[0].geometry.coordinates;
    return route;
  } catch (error) {
    console.error('Mapbox getRoute error:', error);
    return [];
  }
};
