import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import UserTabs from './UserTabs';
import RiderTabs from './RiderTabs';
import UserLiveMapScreen from '../screens/maps/UserLiveMapScreen';
import RiderLiveMapScreen from '../screens/maps/RiderLiveMapScreen';
import { useRole } from '../context/RoleContext';
import BookingScreen from '../screens/dashboard/user/BookingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { loading } = useRole();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelectScreen" component={RoleSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen name="RiderTabs" component={RiderTabs} />

      {/* Booking & Live Maps */}
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
      <Stack.Screen name="UserLiveMapScreen" component={UserLiveMapScreen} />
      <Stack.Screen name="RiderLiveMapScreen" component={RiderLiveMapScreen} />
    </Stack.Navigator>
  );
}
