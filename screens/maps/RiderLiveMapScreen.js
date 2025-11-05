// screens/maps/RiderLiveMapScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { getNearbyUsers } from '../../services/firebase';

const TOMTOM_API_KEY = '7wjmlJ32cE1FKkAlTpAtCcIUiNRxA7Kc';

const RiderLiveMapScreen = ({ route }) => {
  const params = route?.params || {};
  const pickup = params.pickup || null;
  const destination = params.destination || null;

  const [riderLocation, setRiderLocation] = useState(null);
  const [users, setUsers] = useState([]);
  const webviewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Enable Location', 'GPS is required for live tracking.');
        return;
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setRiderLocation(coords);

      const nearby = await getNearbyUsers(coords, 5000);
      setUsers(
        nearby
          .filter(u => u.lastLocation)
          .map(u => ({ id: u.id, location: u.lastLocation }))
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!webviewRef.current || !riderLocation) return;

    const payload = JSON.stringify({ rider: riderLocation, pickup, destination, users });
    webviewRef.current.injectJavaScript(`
      window.updateFromReact(${payload});
      true;
    `);
  }, [riderLocation, users]);

  const html = `
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css" />
  <style>
    body,html,#map { margin:0;padding:0;width:100%;height:100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"></script>
  <script>
    let map, riderMarker, pickupMarker, destinationMarker;
    let userMarkers = [];

    function init() {
      map = tt.map({
        key: '${TOMTOM_API_KEY}',
        container: 'map',
        zoom: 13
      });
    }
    init();

    function clearMarkers() {
      if (riderMarker) riderMarker.remove();
      if (pickupMarker) pickupMarker.remove();
      if (destinationMarker) destinationMarker.remove();
      userMarkers.forEach(m => m.remove());
      userMarkers = [];
    }

    window.updateFromReact = function(data) {
      clearMarkers();

      if (data.rider) {
        riderMarker = new tt.Marker({ color: 'blue' })
          .setLngLat([data.rider.longitude, data.rider.latitude]).addTo(map);
        map.setCenter([data.rider.longitude, data.rider.latitude]);
      }

      if (data.pickup) {
        pickupMarker = new tt.Marker({ color: 'green' })
          .setLngLat([data.pickup.longitude, data.pickup.latitude]).addTo(map);
      }

      if (data.destination) {
        destinationMarker = new tt.Marker({ color: 'red' })
          .setLngLat([data.destination.longitude, data.destination.latitude]).addTo(map);
      }

      if (data.users) {
        data.users.forEach(u => {
          const m = new tt.Marker({ color: 'purple' })
            .setLngLat([u.location.longitude, u.location.latitude]).addTo(map);
          userMarkers.push(m);
        });
      }
    }
  </script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
      />
      <View style={styles.infoBox}>
        <Text style={styles.text}>Live Rider Map</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 5
  },
  text: {
    fontSize: 14,
    fontWeight: '500'
  }
});

export default RiderLiveMapScreen;
