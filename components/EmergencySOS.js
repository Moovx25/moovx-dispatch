import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useLocation } from '../hooks/useLocation';
import { triggerSOS } from '../services/firebase';

const EmergencySOS = ({ visible, onClose, userInfo }) => {
  const [isActivating, setIsActivating] = useState(false);
  const { getCurrentLocation } = useLocation();

  const emergencyContacts = [
    { name: 'Police', number: '199', icon: 'shield' },
    { name: 'Ambulance', number: '199', icon: 'medical' },
    { name: 'Fire Service', number: '199', icon: 'flame' },
    { name: 'Moovx Support', number: '+2348123456789', icon: 'headset' },
  ];

  const activateSOS = async () => {
    setIsActivating(true);
    
    try {
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get current location');
      }
      
      await triggerSOS(userInfo?.id, userInfo?.role || 'user', {
        latitude: location.latitude,
        longitude: location.longitude,
      });

      // Automatically call Moovx Support
      Linking.openURL('tel:+2348123456789');

      Alert.alert(
        'SOS Activated',
        'Emergency alert recorded and Moovx Support contacted. Help is on the way.',
        [
          { text: 'Call Police', onPress: () => Linking.openURL('tel:199') },
          { text: 'OK', onPress: onClose }
        ]
      );
    } catch (error) {
      console.error('SOS activation error:', error);
      Alert.alert('Error', 'Failed to record SOS alert. Please call emergency services directly.');
    } finally {
      setIsActivating(false);
    }
  };

  const callEmergency = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="warning" size={32} color="#FF5722" />
            <Text style={styles.title}>Emergency SOS</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            In case of emergency, tap the SOS button to alert authorities and your emergency contacts with your location.
          </Text>

          <TouchableOpacity
            style={[styles.sosButton, isActivating && styles.sosButtonActivating]}
            onPress={activateSOS}
            disabled={isActivating}
          >
            <Ionicons name="warning" size={40} color="white" />
            <Text style={styles.sosButtonText}>
              {isActivating ? 'ACTIVATING...' : 'ACTIVATE SOS'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.emergencyContacts}>
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactButton}
                onPress={() => callEmergency(contact.number)}
              >
                <Ionicons name={contact.icon} size={24} color={colors.primary} />
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.disclaimer}>
            * SOS will record your location and contact emergency services.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5722',
    flex: 1,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  sosButton: {
    backgroundColor: '#FF5722',
    borderRadius: 50,
    width: 120,
    height: 120,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sosButtonActivating: {
    backgroundColor: '#FF8A65',
  },
  sosButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  emergencyContacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  contactButton: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  contactNumber: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EmergencySOS;