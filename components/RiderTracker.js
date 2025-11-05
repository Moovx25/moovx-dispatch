import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { calculateDistance } from '../utils/location';
import colors from '../constants/colors';

const RiderTracker = ({ rider, userLocation, onCall, onMessage }) => {
  const [distance, setDistance] = useState(0);
  const [eta, setETA] = useState(0);

  useEffect(() => {
    if (rider && rider.location && userLocation && typeof rider.location.latitude === 'number' && typeof rider.location.longitude === 'number' && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        rider.location.latitude,
        rider.location.longitude
      ) / 1000; // Convert meters to km
      setDistance(dist);
      setETA(Math.round((dist / 0.5) * 60)); // Assuming 30km/h speed
    } else {
      setDistance(0);
      setETA(0);
      console.log('Invalid location data for distance calculation:', { rider, userLocation });
    }
  }, [rider, userLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.riderInfo}>
          <Text style={styles.riderName}>{rider.name || 'Unknown Rider'}</Text>
          <Text style={styles.riderDetails}>
            {rider.vehicleNumber || 'N/A'} • {rider.licenseNumber || 'N/A'}
          </Text>
          <View style={styles.rating}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{rider.rating || 0}</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onCall()}>
            <MaterialIcons name="phone" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
            <MaterialIcons name="message" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tracking}>
        <View style={styles.trackingItem}>
          <Text style={styles.trackingLabel}>Distance</Text>
          <Text style={styles.trackingValue}>{distance.toFixed(1)} km</Text>
        </View>
        <View style={styles.trackingItem}>
          <Text style={styles.trackingLabel}>ETA</Text>
          <Text style={styles.trackingValue}>{eta} mins</Text>
        </View>
        <View style={styles.trackingItem}>
          <Text style={styles.trackingLabel}>Status</Text>
          <Text style={[styles.trackingValue, { color: colors.success || '#4CAF50' }]}>
            On the way
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  riderDetails: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tracking: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trackingItem: {
    alignItems: 'center',
  },
  trackingLabel: {
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 4,
  },
  trackingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default RiderTracker;