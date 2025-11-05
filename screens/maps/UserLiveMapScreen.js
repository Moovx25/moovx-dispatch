import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getNearbyRiders, calculateDistance, createRideRequest, auth } from '../../services/firebase';
import { WebView } from 'react-native-webview';

const TOMTOM_API_KEY = '7wjmlJ32cE1FKkAlTpAtCcIUiNRxA7Kc';
const AVERAGE_SPEED_KMH = 40; // Rider average speed
const AVERAGE_SPEED_KMH_PICKUP = 25; // Rider speed to destination

export default function UserLiveMapScreen({ route, navigation }) {
  const { pickup, destination, rideType, fare } = route.params || {};
  const [userLocation, setUserLocation] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);
  const [etaToPickup, setEtaToPickup] = useState(null);
  const [etaToDestination, setEtaToDestination] = useState(null);
  const webviewRef = useRef(null);

  if (!pickup || !destination) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>
          Pickup or destination data missing. Please go back and book a ride.
        </Text>
      </View>
    );
  }

  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'GPS access is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setLoading(false);
    })();
  }, []);

  // Poll for nearby riders
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userLocation) return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setUserLocation(coords);

      const nearbyRiders = await getNearbyRiders(coords, 5000);
      const enrichedRiders = nearbyRiders.map(r => {
        const distanceToPickup = calculateDistance(r.lastLocation, pickup);
        const distancePickupToDest = calculateDistance(pickup, destination);
        const etaPickup = Math.ceil(distanceToPickup / 1000 / AVERAGE_SPEED_KMH * 60);
        const etaDest = Math.ceil(distancePickupToDest / 1000 / AVERAGE_SPEED_KMH_PICKUP * 60);
        return {
          id: r.id,
          location: r.lastLocation,
          name: r.name || r.id,
          isOnline: r.isOnline,
          etaToPickup: etaPickup,
          etaToDestination: etaDest
        };
      });
      setRiders(enrichedRiders);

      if (selectedRider) {
        const rider = enrichedRiders.find(r => r.id === selectedRider.id);
        if (!rider || !rider.isOnline) {
          setSelectedRider(null); // Rider went offline
          setEtaToPickup(null);
          setEtaToDestination(null);
        } else {
          setEtaToPickup(rider.etaToPickup);
          setEtaToDestination(rider.etaToDestination);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [userLocation, selectedRider]);

  // Inject markers & routes into WebView
  useEffect(() => {
    if (webviewRef.current && userLocation) {
      const payload = JSON.stringify({ user: userLocation, pickup, destination, riders, selectedRider });
      webviewRef.current.injectJavaScript(`window.updateMap('${payload}'); true;`);
    }
  }, [userLocation, riders, selectedRider]);

  const createMapHtml = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css"/>
        <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"></script>
        <style>html, body, #map { margin:0; padding:0; width:100%; height:100%; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = tt.map({ key: '${TOMTOM_API_KEY}', container: 'map', center: [${pickup.longitude}, ${pickup.latitude}], zoom: 14 });
          let markers = [];
          let routeLayer = null;

          function clearMarkers() {
            markers.forEach(m => m.remove());
            markers = [];
          }

          function addMarker(lon, lat, color, htmlContent, onClick) {
            if(lon == null || lat == null) return;
            const marker = new tt.Marker({ color }).setLngLat([lon, lat]);
            if(htmlContent) marker.setPopup(new tt.Popup().setHTML(htmlContent));
            marker.addTo(map);
            if(onClick) marker.getElement().addEventListener('click', onClick);
            markers.push(marker);
          }

          function drawRoute(coords) {
            if(routeLayer) {
              if(map.getLayer('route')) map.removeLayer('route');
              if(map.getSource('route')) map.removeSource('route');
            }
            if(coords.length < 2) return;
            map.addLayer({
              id: 'route',
              type: 'line',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } },
              paint: { 'line-color': '#007bff', 'line-width': 4 }
            });
            routeLayer = true;
          }

          window.updateMap = function(payload) {
            const data = JSON.parse(payload);
            clearMarkers();

            // User
            if(data.user) addMarker(data.user.longitude, data.user.latitude, 'blue', 'You');

            // Pickup & Destination
            if(data.pickup) addMarker(data.pickup.longitude, data.pickup.latitude, 'green', 'Pickup');
            if(data.destination) addMarker(data.destination.longitude, data.destination.latitude, 'red', 'Destination');

            // Riders
            if(data.riders) {
              data.riders.forEach(r => {
                const popupHtml = "<b>" + r.name + "</b><br/>" +
                                  "ETA to Pickup: " + r.etaToPickup + " min<br/>" +
                                  "ETA to Destination: " + r.etaToDestination + " min<br/>" +
                                  "Status: " + (r.isOnline ? "Online" : "Offline") +
                                  (data.selectedRider && data.selectedRider.id === r.id ? "<br/><i>Selected</i>" : "");
                addMarker(r.location.longitude, r.location.latitude, r.isOnline ? 'purple' : 'gray', popupHtml, () => {
                  if(r.isOnline) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selectRider', riderId: r.id }));
                });
              });
            }

            // Draw route from user → rider → destination
            if(data.selectedRider && data.selectedRider.isOnline) {
              const coordinates = [
                [data.user.longitude, data.user.latitude],
                [data.selectedRider.location.longitude, data.selectedRider.location.latitude],
                [data.destination.longitude, data.destination.latitude]
              ];
              drawRoute(coordinates);
            }
          };
        </script>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'selectRider') {
        const rider = riders.find(r => r.id === msg.riderId);
        if (rider && rider.isOnline) setSelectedRider(rider);
      }
    } catch (e) {
      console.error('Invalid WebView message', e);
    }
  };

  const bookSelectedRider = async () => {
    if (!selectedRider) {
      Alert.alert('No rider selected', 'Please select a rider on the map to proceed.');
      return;
    }
    try {
      const rideId = await createRideRequest({
        userId: auth.currentUser.uid,
        pickup,
        destination,
        rideType,
        fare,
        riderId: selectedRider.id,
        status: 'pending',
      });
      Alert.alert('Ride Booked', `Ride ID: ${rideId}`, [
        { text: 'OK', onPress: () => navigation.navigate('UserHomeScreen') }
      ]);
    } catch (e) {
      console.error('Error creating ride request:', e);
      Alert.alert('Error', 'Failed to book ride');
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ html: createMapHtml() }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleWebViewMessage}
      />
      {selectedRider && (
        <TouchableOpacity style={styles.bookButton} onPress={bookSelectedRider}>
          <Text style={styles.bookButtonText}>
            Book {selectedRider.name} | ETA {etaToPickup} min
          </Text>
        </TouchableOpacity>
      )}
      {riders.length === 0 && (
        <View style={styles.centerOverlay}>
          <Text style={{ fontSize: 16, color: '#333' }}>No riders available nearby</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  bookButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  centerOverlay: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
