import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logoutUser } from '../../../services/firebase';
import colors from '../../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('User signed out successfully');
      Alert.alert('Success', 'You have been signed out successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RiderProfile')}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;