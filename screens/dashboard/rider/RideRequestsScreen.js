// screens/dashboard/rider/RideRequestsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRole } from '../../../context/RoleContext';
import { listenToPendingRequests, acceptRideRequest, listenToRideUpdates } from '../../../services/firebase';
import { calculateDistance } from '../../../utils/routing'; // Updated import
import { useLocation } from '../../../hooks/useLocation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import colors from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RideRequestsScreen({ route }) {
  const { userId, userLocation } = useRole();
  const { location } = useLocation();
  const [requests, setRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  
  const rideId = route?.params?.rideId;

  useEffect(() => {
    const unsubscribeRequests = listenToPendingRequests((requests) => {
      const requestsWithDistance = requests.map(request => {
        let distance = null;
        if (location && request.pickup) {
          distance = calculateDistance(
            location,
            { latitude: request.pickup.latitude, longitude: request.pickup.longitude }
          );
        }
        return { ...request, distance };
      });
      
      requestsWithDistance.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
      
      setRequests(requestsWithDistance);
    });
    
    return () => unsubscribeRequests();
  }, [location]);

  useEffect(() => {
    if (rideId) {
      const unsubscribeRide = listenToRideUpdates(rideId, (ride) => {
        setActiveRide(ride);
      });
      
      return () => unsubscribeRide;
    }
  }, [rideId]);

  const handleAcceptRide = async (requestId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const ride = await acceptRideRequest(requestId, userId);
      setActiveRide(ride);
      navigation.navigate('LiveMap', { rideId: ride.id }); // Navigate to RiderLiveMapScreen
      Alert.alert('Ride Accepted', 'You have accepted the ride request');
    } catch (error) {
      console.error('Error accepting ride:', error);
      Alert.alert('Error', 'Failed to accept ride request');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDistance = (distance) => {
    if (distance === null) return 'Unknown';
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const renderRequestItem = ({ item }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>Ride Request</Text>
        <Text style={styles.distanceText}>{formatDistance(item.distance)} away</Text>
      </View>
      
      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.pickup?.address || 'Pickup location'}
          </Text>
        </View>
        
        <View style={styles.locationItem}>
          <Ionicons name="flag" size={16} color={colors.success} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.destination?.address || 'Destination'}
          </Text>
        </View>
      </View>
      
      <View style={styles.requestFooter}>
        <Text style={styles.fareText}>Price: ₦{item.price || '0.00'}</Text>
        <Button
          title="Accept"
          onPress={() => handleAcceptRide(item.id)}
          loading={loading}
          style={styles.acceptButton}
        />
      </View>
    </Card>
  );

  const renderActiveRide = () => (
    <Card style={styles.activeRideCard}>
      <Text style={styles.activeRideTitle}>Active Ride</Text>
      
      <View style={styles.rideDetails}>
        <View style={styles.rideDetailItem}>
          <Text style={styles.rideDetailLabel}>Status:</Text>
          <Text style={[styles.rideDetailValue, { color: getStatusColor(activeRide.status) }]}>
            {activeRide.status}
          </Text>
        </View>
        
        <View style={styles.rideDetailItem}>
          <Text style={styles.rideDetailLabel}>User:</Text>
          <Text style={styles.rideDetailValue}>{activeRide.userId}</Text>
        </View>
        
        <View style={styles.rideDetailItem}>
          <Text style={styles.rideDetailLabel}>Price:</Text>
          <Text style={styles.rideDetailValue}>₦{activeRide.price || '0.00'}</Text>
        </View>
      </View>
      
      <View style={styles.rideLocations}>
        <View style={styles.locationItem}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {activeRide.pickup?.address || 'Pickup location'}
          </Text>
        </View>
        
        <View style={styles.locationItem}>
          <Ionicons name="flag" size={16} color={colors.success} />
          <Text style={styles.locationText} numberOfLines={1}>
            {activeRide.destination?.address || 'Destination'}
          </Text>
        </View>
      </View>
      
      <Button
        title="View on Map"
        onPress={() => navigation.navigate('LiveMap', { rideId: activeRide.id })}
        style={styles.mapButton}
      />
    </Card>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return colors.primary;
      case 'in_progress':
        return colors.warning;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.text;
    }
  };

  return (
    <View style={styles.container}>
      {activeRide ? (
        renderActiveRide()
      ) : (
        <>
          <Text style={styles.title}>Ride Requests</Text>
          
          {requests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={colors.secondary} />
              <Text style={styles.emptyText}>No ride requests available</Text>
            </View>
          ) : (
            <FlatList
              data={requests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  requestCard: {
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  distanceText: {
    fontSize: 14,
    color: colors.secondary,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  acceptButton: {
    width: 100,
  },
  activeRideCard: {
    marginBottom: 15,
  },
  activeRideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  rideDetails: {
    marginBottom: 15,
  },
  rideDetailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rideDetailLabel: {
    fontSize: 14,
    color: colors.secondary,
    width: 80,
  },
  rideDetailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  rideLocations: {
    marginBottom: 15,
  },
  mapButton: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.secondary,
    marginTop: 10,
  },
});