import * as Location from 'expo-location';

export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 30000,
    });
    return location.coords;
  } catch (error) {
    console.error('getCurrentLocation error:', error.code, error.message);
    throw error;
  }
}