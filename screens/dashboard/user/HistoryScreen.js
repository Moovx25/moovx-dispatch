import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../components/Card';
import colors from '../../../constants/colors';

const HistoryScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('all');

  const rideHistory = [
    {
      id: '1',
      date: '2024-01-15',
      time: '2:30 PM',
      from: 'Home',
      to: 'Office Complex',
      fare: 500,
      status: 'completed',
      rideType: 'bike',
      rider: 'John Doe',
      rating: 5,
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '6:45 PM',
      from: 'Shopping Mall',
      to: 'Home',
      fare: 350,
      status: 'completed',
      rideType: 'bike',
      rider: 'Jane Smith',
      rating: 4,
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '9:15 AM',
      from: 'Airport',
      to: 'Hotel',
      fare: 800,
      status: 'cancelled',
      rideType: 'car',
      rider: 'Mike Johnson',
      rating: null,
    },
    {
      id: '4',
      date: '2024-01-12',
      time: '4:20 PM',
      from: 'University',
      to: 'Home',
      fare: 400,
      status: 'completed',
      rideType: 'bike',
      rider: 'Sarah Wilson',
      rating: 5,
    },
  ];

  const tabs = [
    { id: 'all', title: 'All Rides' },
    { id: 'completed', title: 'Completed' },
    { id: 'cancelled', title: 'Cancelled' },
  ];

  const filteredRides = rideHistory.filter(ride => 
    selectedTab === 'all' || ride.status === selectedTab
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'cancelled':
        return '#FF3B30';
      default:
        return colors.secondary;
    }
  };

  const getRideTypeIcon = (type) => {
    switch (type) {
      case 'bike':
        return '🏍️';
      case 'car':
        return '🚗';
      case 'premium':
        return '🚙';
      default:
        return '🚗';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={12}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderRideItem = ({ item }) => (
    <Card style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.rideTypeContainer}>
          <Text style={styles.rideTypeIcon}>{getRideTypeIcon(item.rideType)}</Text>
          <View>
            <Text style={styles.rideDate}>{item.date}</Text>
            <Text style={styles.rideTime}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
          <Text style={styles.fare}>₦{item.fare}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.location}>{item.from}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
          <Text style={styles.location}>{item.to}</Text>
        </View>
      </View>

      {item.status === 'completed' && (
        <View style={styles.riderInfo}>
          <Text style={styles.riderName}>Rider: {item.rider}</Text>
          {renderStars(item.rating)}
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="receipt-outline" size={16} color={colors.primary} />
          <Text style={styles.actionText}>Receipt</Text>
        </TouchableOpacity>
        {item.status === 'completed' && !item.rating && (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="star-outline" size={16} color={colors.primary} />
            <Text style={styles.actionText}>Rate</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
          <Text style={styles.actionText}>Book Again</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride History</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { fontSize: 16, color: colors.secondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  listContainer: { paddingHorizontal: 20 },
  rideCard: { marginBottom: 16 },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideTypeContainer: { flexDirection: 'row', alignItems: 'center' },
  rideTypeIcon: { fontSize: 24, marginRight: 12 },
  rideDate: { fontSize: 16, fontWeight: '600', color: colors.text },
  rideTime: { fontSize: 14, color: colors.secondary, marginTop: 2 },
  statusContainer: { alignItems: 'flex-end' },
  status: { fontSize: 12, fontWeight: 'bold' },
  fare: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 4 },
  routeContainer: { marginBottom: 16 },
  routePoint: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  location: { fontSize: 14, color: colors.text, flex: 1 },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 4,
    marginBottom: 8,
  },
  riderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  riderName: { fontSize: 14, color: colors.secondary },
  starsContainer: { flexDirection: 'row' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default HistoryScreen;