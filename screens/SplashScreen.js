import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../services/firebase';
import { useRole } from '../context/RoleContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const user = auth.currentUser;

      if (user) {
        // Navigate to correct dashboard based on RoleContext
        if (role === 'RIDER') navigation.reset({ index: 0, routes: [{ name: 'RiderTabs' }] });
        else navigation.reset({ index: 0, routes: [{ name: 'UserTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'RoleSelectScreen' }] });
      }
    }, 2000); // show splash for 2 seconds

    return () => clearTimeout(timeout);
  }, [navigation, role]);

  return (
    <LinearGradient colors={['#0000ff', '#ff0000']} style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
