import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from '../../../components/MapView';
import { db } from '../../../services/firebase';
import { onValue, ref } from 'firebase/database';
import { getRoute } from '../../../services/mapbox';

const RiderLiveMapScreen = ({ route }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const userId = route.params?.userId || 'user1'; // Example

  // Subscribe to user location
  useEffect(() => {
    const userRef = ref(db, `users/${userId}/location`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const loc = snapshot.val();
      if (loc) setUserLocation({ latitude: loc.lat, longitude: loc.lng });
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to rider location
  useEffect(() => {
    const riderRef = ref(db, 'riders/rider1/location'); // Example
    const unsubscribe = onValue(riderRef, (snapshot) => {
      const loc = snapshot.val();
      if (loc) setRiderLocation({ latitude: loc.lat, longitude: loc.lng });
    });
    return () => unsubscribe();
  }, []);

  // Fetch route whenever locations change
  useEffect(() => {
    const fetchRoute = async () => {
      if (userLocation && riderLocation) {
        const coords = await getRoute(
          [riderLocation.longitude, riderLocation.latitude],
          [userLocation.longitude, userLocation.latitude]
        );
        setRouteCoordinates(coords);
      }
    };
    fetchRoute();
  }, [userLocation, riderLocation]);

  return (
    <View style={styles.container}>
      <MapView
        userLocation={userLocation}
        riderLocations={riderLocation ? [riderLocation] : []}
        routeCoordinates={routeCoordinates}
      />
    </View>
  );
};

export default RiderLiveMapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
