import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from '../../../components/MapView';
import { db } from '../../../services/firebase';
import { onValue, ref } from 'firebase/database';
import { getRoute } from '../../../services/mapbox';

const UserLiveMapScreen = ({ route }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [riderLocations, setRiderLocations] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const userId = route.params?.userId || 'user1';

  // Subscribe to user location
  useEffect(() => {
    const userRef = ref(db, `users/${userId}/location`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const loc = snapshot.val();
      if (loc) setUserLocation({ latitude: loc.lat, longitude: loc.lng });
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to all assigned riders
  useEffect(() => {
    const ridersRef = ref(db, 'riders'); // Example: all riders
    const unsubscribe = onValue(ridersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locations = Object.keys(data).map((key) => ({
          id: key,
          latitude: data[key].location.lat,
          longitude: data[key].location.lng,
        }));
        setRiderLocations(locations);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch routes from each rider to user
  useEffect(() => {
    const fetchRoute = async () => {
      if (userLocation && riderLocations.length > 0) {
        const coords = await getRoute(
          [riderLocations[0].longitude, riderLocations[0].latitude],
          [userLocation.longitude, userLocation.latitude]
        );
        setRouteCoordinates(coords);
      }
    };
    fetchRoute();
  }, [userLocation, riderLocations]);

  return (
    <View style={styles.container}>
      <MapView
        userLocation={userLocation}
        riderLocations={riderLocations}
        routeCoordinates={routeCoordinates}
      />
    </View>
  );
};

export default UserLiveMapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
