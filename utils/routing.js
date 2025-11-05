// utils/routing.js
import { getRoute as getTomTomRoute } from '../services/tomtom';

export const getRoute = async ({ pickup, destination }) => {
  try {
    console.log('🗺️ Calculating route from', pickup, 'to', destination);
    
    const routeData = await getTomTomRoute({ origin: pickup, destination });
    
    console.log('✅ Route created with', routeData.coordinates.length, 'points');
    console.log('🎯 Final destination:', routeData.coordinates[routeData.coordinates.length - 1]);
    console.log('📏 Distance:', routeData.distance, 'meters');
    console.log('⏱️ Travel time:', routeData.travelTime, 'seconds');
    
    return {
      coordinates: routeData.coordinates,
      distance: routeData.distance,
      duration: routeData.travelTime,
      trafficDelay: routeData.trafficDelay || 0
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    throw error;
  }
};

export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Return distance in meters
};

export const calculateFare = (distanceInMeters, travelTimeInSeconds) => {
  const baseFare = 2.0; // $2.00 base fare
  const distanceRate = 0.001; // $0.001 per meter
  const timeRate = 0.003; // $0.003 per second
  
  const distanceFare = distanceInMeters * distanceRate;
  const timeFare = travelTimeInSeconds * timeRate;
  
  const price = Math.max(baseFare + distanceFare + timeFare, 5.0);
  
  return {
    baseFare,
    distanceFare,
    timeFare,
    price: parseFloat(price.toFixed(2)),
  };
};

export const calculateETA = (pickup, destination, currentTime = new Date()) => {
  return new Promise(async (resolve, reject) => {
    try {
      const routeData = await getTomTomRoute({ origin: pickup, destination });
      const eta = new Date(currentTime.getTime() + (routeData.travelTime * 1000));
      resolve({
        eta,
        travelTime: routeData.travelTime,
        distance: routeData.distance
      });
    } catch (error) {
      reject(error);
    }
  });
};