import axios from 'axios';
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY || '7wjmlJ32cE1FKkAlTpAtCcIUiNRxA7Kc';

export const geocodeAddress = async (address) => {
  const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json`, {
    params: { key: TOMTOM_API_KEY, limit: 1 }
  });
  const result = response.data.results[0];
  if (!result) throw new Error('No results found');
  return { latitude: result.position.lat, longitude: result.position.lon, address: result.address.freeformAddress };
};

export const getRoute = async ({ origin, destination, waypoints = [] }) => {
  let waypointsStr = waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join(':');
  if (waypointsStr) waypointsStr += ':';
  const response = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${origin.latitude},${origin.longitude}:${waypointsStr}${destination.latitude},${destination.longitude}/json`, {
    params: { key: TOMTOM_API_KEY, travelMode: 'motorcycle', routeType: 'fastest', traffic: true }
  });
  const route = response.data.routes[0];
  if (!route) throw new Error('No route found');
  return { coordinates: route.legs[0].points.map(p => ({ latitude: p.latitude, longitude: p.longitude })), distance: route.summary.lengthInMeters, travelTime: route.summary.travelTimeInSeconds };
};

export const calculateETA = async (origin, destination) => {
  const routeData = await getRoute({ origin, destination });
  const etaDate = new Date(Date.now() + routeData.travelTime * 1000);
  return { eta: etaDate, travelTime: routeData.travelTime, distance: routeData.distance };
};
