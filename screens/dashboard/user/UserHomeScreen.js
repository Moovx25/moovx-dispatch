import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import colors from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { db, initializeUser } from '../../../services/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useRole } from '../../../context/RoleContext';

const UserHomeScreen = ({ navigation }) => {
  const { userId } = useRole();
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick actions: Book a ride now goes to BookingScreen
  const quickActions = useMemo(() => [
    { title: 'Book a Ride', icon: 'bicycle-outline', onPress: () => navigation.navigate('BookingScreen') },
    { title: 'My Wallet', icon: 'wallet-outline', onPress: () => navigation.navigate('Wallet') },
    { title: 'Chat Support', icon: 'chatbubble-outline', onPress: () => navigation.navigate('Chat') },
    { title: 'Ride History', icon: 'document-text-outline', onPress: () => navigation.navigate('History') },
  ], [navigation]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    initializeUser(userId, 'user').catch(error => console.error('Error initializing user:', error));

    const q = query(
      collection(db, 'rides'),
      where('userId', '==', userId),
      where('status', 'in', ['completed', 'cancelled']),
      orderBy('createdAt', 'desc'),
      limit(2)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const rides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        pickup: doc.data().pickup || doc.data().origin,
        destination: doc.data().destination || doc.data().destination,
      }));
      setRecentRides(rides);
      setLoading(false);
    }, error => {
      console.error('Error fetching recent rides:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const getStatusColor = status => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'accepted': return '#007BFF';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, User! 👋</Text>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.subtitle}>Where would you like to go today?</Text>
      </View>

      <Card style={[styles.quickActionsCard, { padding: 6 }]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAction}
              onPress={action.onPress}
            >
              <Ionicons name={action.icon} size={22} color={colors.primary} />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={[styles.recentRidesCard, { padding: 6 }]}>
        <Text style={styles.sectionTitle}>Recent Rides</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading recent rides...</Text>
        ) : recentRides.length > 0 ? (
          recentRides.map(ride => (
            <View key={ride.id} style={styles.rideItem}>
              <View style={styles.rideInfo}>
                <Text style={styles.rideRoute}>
                  {ride.pickup?.address?.substring(0, 20) || 'Pickup'} → {' '}
                  {ride.destination?.address?.substring(0, 20) || 'Destination'}
                </Text>
                <Text style={styles.rideDate}>
                  {ride.createdAt ? new Date(ride.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                </Text>
              </View>
              <Text style={[styles.rideStatus, { color: getStatusColor(ride.status) }]}>
                {ride.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.rideDate}>No recent rides</Text>
        )}
      </Card>

      <Button
        title="Book New Ride"
        onPress={() => navigation.navigate('BookingScreen')}
        style={styles.bookButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { paddingBottom: 20 },
  header: { padding: 20, paddingTop: 40, position: 'relative' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.secondary },
  settingsIcon: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  quickActionsCard: { marginHorizontal: 16, marginVertical: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 18 },
  quickAction: {
    width: '42%',
    minHeight: 75,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 4,
    paddingTop: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  actionTitle: { fontSize: 11, fontWeight: '600', color: colors.text, textAlign: 'center', marginTop: 4, lineHeight: 14 },
  recentRidesCard: { marginHorizontal: 16, marginVertical: 4 },
  rideItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rideInfo: { flex: 1 },
  rideRoute: { fontSize: 16, fontWeight: '600', color: colors.text },
  rideDate: { fontSize: 14, color: colors.secondary, marginTop: 4 },
  rideStatus: { fontSize: 14, fontWeight: '600' },
  bookButton: { margin: 16, marginTop: 0 },
  loadingText: { textAlign: 'center', color: colors.secondary, padding: 10 }
});

export default UserHomeScreen;
