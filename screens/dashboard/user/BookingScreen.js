import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BIKE_RATE = 250;
const VAN_RATE = 300;

export default function BookingScreen() {
  const navigation = useNavigation();
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupName, setPickupName] = useState('Fetching location...');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [vehicleType, setVehicleType] = useState('bike');
  const [fare, setFare] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);

  const bikeAnim = useRef(new Animated.Value(1)).current;
  const vanAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'GPS access is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setCurrentLocation(coords);

      const reverse = await Location.reverseGeocodeAsync(coords);
      if (reverse.length > 0) {
        const place = reverse[0];
        setPickupName(`${place.name || place.street}, ${place.city || ''}`);
      } else {
        setPickupName('Unknown location');
      }
    })();
  }, []);

  const searchDestination = async () => {
    if (!destination) return Alert.alert('Error', 'Enter a destination');
    const geo = await Location.geocodeAsync(destination);
    if (!geo.length) return Alert.alert('Not found', 'Invalid destination');
    const coords = {
      latitude: geo[0].latitude,
      longitude: geo[0].longitude,
    };
    setDestinationCoords(coords);
    calculateFare(coords, vehicleType);
  };

  const calculateFare = (destGeo, type) => {
    if (!currentLocation) return;
    const R = 6371;
    const dLat = ((destGeo.latitude - currentLocation.latitude) * Math.PI) / 180;
    const dLon = ((destGeo.longitude - currentLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((currentLocation.latitude * Math.PI) / 180) *
        Math.cos((destGeo.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    setDistanceKm(distance.toFixed(1));
    setFare(Math.ceil(type === 'bike' ? distance * BIKE_RATE : distance * VAN_RATE));
  };

  const selectVehicle = (type) => {
    setVehicleType(type);
    if (destinationCoords) calculateFare(destinationCoords, type);

    const anim = type === 'bike' ? bikeAnim : vanAnim;
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const swapLocations = () => {
    if (destinationCoords && currentLocation) {
      const temp = destinationCoords;
      setDestinationCoords(currentLocation);
      setCurrentLocation(temp);
      calculateFare(temp, vehicleType);
    }
  };

  const bookRide = () => {
    if (!currentLocation || !destinationCoords || !fare) {
      Alert.alert('Error', 'Please enter destination first.');
      return;
    }
    // FIXED: Navigate to the correct registered screen
    navigation.navigate('UserLiveMapScreen', {
      pickup: currentLocation,
      destination: destinationCoords,
      rideType: vehicleType,
      fare,
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>Ride Booking</Text>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Ionicons name="location" size={22} color="#007bff" />
          <Text style={styles.pickupText}>{pickupName}</Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <Ionicons name="flag-sharp" size={22} color="#ff4444" />
        <TextInput
          placeholder="Enter destination"
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <TouchableOpacity style={styles.searchBtn} onPress={searchDestination}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.swapBtn} onPress={swapLocations}>
        <Ionicons name="swap-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.vehicleRow}>
        <Animated.View style={{ transform: [{ scale: bikeAnim }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.vehicleBtn, vehicleType === 'bike' && styles.activeVehicle]}
            onPress={() => selectVehicle('bike')}
          >
            <Ionicons name="bicycle" size={28} color="#fff" />
            <Text style={styles.vehicleTxt}>Bike</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: vanAnim }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.vehicleBtn, vehicleType === 'van' && styles.activeVehicle]}
            onPress={() => selectVehicle('van')}
          >
            <Ionicons name="bus" size={28} color="#fff" />
            <Text style={styles.vehicleTxt}>Van</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {fare && (
        <Animated.View style={styles.resultCard}>
          <Text style={styles.resultText}>Distance: {distanceKm} km</Text>
          <Text style={styles.resultText}>Fare: ₦{fare}</Text>
        </Animated.View>
      )}

      <TouchableOpacity
        style={[styles.bookBtn, (!destinationCoords || !fare) && { opacity: 0.5 }]}
        disabled={!destinationCoords || !fare}
        onPress={bookRide}
      >
        <Text style={styles.bookTxt}>Book Ride</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 60, backgroundColor: '#f9fbff' },
  header: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 14 },
  card: { backgroundColor: '#eef6ff', padding: 14, borderRadius: 12, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center' },
  pickupText: { marginLeft: 10, fontSize: 15, fontWeight: '500', color: '#007bff' },
  inputRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  input: { marginLeft: 8, flex: 1, fontSize: 15 },
  searchBtn: { backgroundColor: '#007bff', padding: 12, borderRadius: 12 },
  searchBtnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  swapBtn: { alignSelf: 'center', backgroundColor: '#007bff', padding: 6, marginTop: 10, borderRadius: 40 },
  vehicleRow: { flexDirection: 'row', marginTop: 18 },
  vehicleBtn: { backgroundColor: '#555', padding: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', elevation: 4 },
  activeVehicle: { backgroundColor: '#007bff' },
  vehicleTxt: { color: '#fff', marginTop: 6, fontWeight: '700' },
  resultCard: { backgroundColor: '#fff', marginTop: 18, padding: 14, borderRadius: 12 },
  resultText: { fontSize: 17, fontWeight: '600' },
  bookBtn: { backgroundColor: 'green', marginTop: 20, padding: 16, borderRadius: 12 },
  bookTxt: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '700' },
});
