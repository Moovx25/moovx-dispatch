import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getCurrentLocation } from '../utils/location';

const LocationSharing = ({ onLocationShare }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    getCurrentLocationData();
  }, []);

  const getCurrentLocationData = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const generateLocationLink = () => {
    if (!currentLocation) return null;
    
    const { latitude, longitude } = currentLocation;
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  };

  const shareLocation = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    setIsSharing(true);
    const locationLink = generateLocationLink();
    
    try {
      await Share.share({
        message: `Here's my current location: ${locationLink}`,
        url: locationLink,
        title: 'My Location',
      });
      
      if (onLocationShare) {
        onLocationShare(currentLocation);
      }
    } catch (error) {
      console.error('Error sharing location:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const copyLocationLink = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    const locationLink = generateLocationLink();
    await Clipboard.setString(locationLink);
    Alert.alert('Copied', 'Location link copied to clipboard');
  };

  const sendLocationToContact = async (contactType) => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    const locationLink = generateLocationLink();
    const message = `I'm sharing my location with you: ${locationLink}`;

    try {
      if (contactType === 'sms') {
        // Open SMS app with pre-filled message
        const url = `sms:?body=${encodeURIComponent(message)}`;
        await Linking.openURL(url);
      } else if (contactType === 'whatsapp') {
        // Open WhatsApp with pre-filled message
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        await Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open messaging app');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={24} color={colors.primary} />
        <Text style={styles.title}>Share Location</Text>
      </View>

      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.coordinates}>
            📍 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
          <Text style={styles.accuracy}>
            Accuracy: ±{Math.round(currentLocation.accuracy)}m
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={shareLocation}
          disabled={isSharing || !currentLocation}
        >
          <Ionicons name="share" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>
            {isSharing ? 'Sharing...' : 'Share Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={copyLocationLink}
          disabled={!currentLocation}
        >
          <Ionicons name="copy" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Copy Link
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickShare}>
        <Text style={styles.quickShareTitle}>Quick Share</Text>
        <View style={styles.quickShareButtons}>
          <TouchableOpacity
            style={styles.quickShareButton}
            onPress={() => sendLocationToContact('sms')}
            disabled={!currentLocation}
          >
            <Ionicons name="chatbubble" size={20} color={colors.primary} />
            <Text style={styles.quickShareText}>SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickShareButton}
            onPress={() => sendLocationToContact('whatsapp')}
            disabled={!currentLocation}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.quickShareText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickShareButton}
            onPress={getCurrentLocationData}
          >
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            <Text style={styles.quickShareText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coordinates: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'monospace',
  },
  accuracy: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  quickShare: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  quickShareTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quickShareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickShareButton: {
    alignItems: 'center',
    padding: 8,
  },
  quickShareText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default LocationSharing;