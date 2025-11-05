import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const RiderInfo = ({ rider, onCall, onMessage, onTrack }) => {
  if (!rider) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: rider.avatar || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{rider.name}</Text>
          <Text style={styles.rating}>⭐ {rider.rating || '4.5'} ({rider.trips || '0'} trips)</Text>
          <Text style={styles.vehicle}>{rider.vehicle || 'Motorcycle'} • {rider.plateNumber}</Text>
        </View>
        <View style={styles.status}>
          <View style={[styles.statusDot, { backgroundColor: rider.isOnline ? '#4CAF50' : '#FF5722' }]} />
          <Text style={styles.statusText}>{rider.isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onCall(rider.phone)}>
          <Ionicons name="call" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => onMessage(rider.id)}>
          <Ionicons name="chatbubble" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => onTrack(rider.id)}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Track</Text>
        </TouchableOpacity>
      </View>

      {rider.estimatedArrival && (
        <View style={styles.eta}>
          <Ionicons name="time" size={16} color={colors.text} />
          <Text style={styles.etaText}>ETA: {rider.estimatedArrival}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  rating: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vehicle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  status: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  eta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  etaText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default RiderInfo;