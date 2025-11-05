import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'; // ✅ red location icon
import { useRole } from '../../../context/RoleContext'; // ✅ correct import path

export default function RiderHomeScreen({ navigation }) {
  const { userId, updateRiderLocation, toggleOnlineStatus, isOnline } = useRole();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Get current live location
  const fetchLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLocation(loc.coords);

      const [reverse] = await Location.reverseGeocodeAsync(loc.coords);
      if (reverse) {
        const readable = `${reverse.name || ''}, ${reverse.street || ''}, ${reverse.city || ''}, ${reverse.region || ''}`;
        setAddress(readable);
      }

      await updateRiderLocation(loc.coords);
    } catch (error) {
      console.error('Error updating rider location:', error);
      Alert.alert('Error', 'Failed to get location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚖 Rider Dashboard</Text>

      {/* 📍 Current location row with red pin icon */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={22} color="red" style={{ marginRight: 6 }} />
        <Text style={styles.locationText}>
          {loading
            ? 'Fetching location...'
            : address || 'Location not available'}
        </Text>
      </View>

      {/* 🟢 Toggle online/offline */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isOnline ? '#ff3b30' : '#34c759' }]}
        onPress={async () => {
          await toggleOnlineStatus();
        }}
      >
        <Text style={styles.buttonText}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Text>
      </TouchableOpacity>

      {/* 🌍 View Live Map */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('RiderLiveMapScreen')}
      >
        <Text style={styles.secondaryText}>View Live Map</Text>
      </TouchableOpacity>
    </View>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 25,
    elevation: 3,
  },
  locationText: {
    fontSize: 14,
    flexShrink: 1,
    color: '#333',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
