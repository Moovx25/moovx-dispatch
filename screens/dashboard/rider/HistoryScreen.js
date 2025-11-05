import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../../components/Card';
import colors from '../../../constants/colors';

const HistoryScreen = () => {
  const rideHistory = [
    {
      id: 1,
      passenger: 'Sarah Johnson',
      from: 'Lagos Mall',
      to: 'Victoria Island',
      date: 'Today, 9:30 AM',
      fare: 500,
      rating: 5,
    },
    {
      id: 2,
      passenger: 'Mike Chen',
      from: 'Airport Terminal',
      to: 'Lekki Phase 1',
      date: 'Yesterday, 6:15 PM',
      fare: 1200,
      rating: 4,
    },
    {
      id: 3,
      passenger: 'Emma Wilson',
      from: 'Ikeja Mall',
      to: 'Surulere',
      date: '2 days ago, 2:00 PM',
      fare: 800,
      rating: 5,
    },
  ];

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride History</Text>
        <Text style={styles.subtitle}>Your completed rides</Text>
      </View>

      {rideHistory.map((ride) => (
        <Card key={ride.id} style={styles.rideCard}>
          <View style={styles.rideHeader}>
            <Text style={styles.rideDate}>{ride.date}</Text>
            <Text style={styles.rideFare}>₦{ride.fare}</Text>
          </View>

          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{ride.passenger}</Text>
            <Text style={styles.rating}>{getRatingStars(ride.rating)}</Text>
          </View>

          <View style={styles.rideRoute}>
            <Text style={styles.routeText}>
              <Text style={styles.routeLabel}>From: </Text>
              {ride.from}
            </Text>
            <Text style={styles.routeText}>
              <Text style={styles.routeLabel}>To: </Text>
              {ride.to}
            </Text>
          </View>

          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    marginTop: 4,
  },
  rideCard: {
    margin: 20,
    marginTop: 0,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideDate: {
    fontSize: 14,
    color: colors.secondary,
  },
  rideFare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  passengerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rating: {
    fontSize: 14,
  },
  rideRoute: {
    marginBottom: 16,
  },
  routeText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  routeLabel: {
    fontWeight: '600',
    color: colors.secondary,
  },
  detailsButton: {
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HistoryScreen; 