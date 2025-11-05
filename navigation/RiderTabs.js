import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import RiderHomeScreen from '../screens/dashboard/rider/RiderHomeScreen';
import EarningsScreen from '../screens/dashboard/rider/EarningsScreen';
import HistoryScreen from '../screens/dashboard/rider/HistoryScreen';
import ChatScreen from '../screens/dashboard/rider/ChatScreen';
import RiderProfileScreen from '../screens/dashboard/rider/RiderProfileScreen';
import RiderChangePasswordScreen from '../screens/dashboard/rider/RiderChangePasswordScreen';
import RiderLiveMapScreen from '../screens/maps/RiderLiveMapScreen';
import RideRequestsScreen from '../screens/dashboard/rider/RideRequestsScreen';
import SettingsScreen from '../screens/dashboard/rider/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function RiderTabNavigator() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'bicycle-outline';
              break;
            case 'LiveMap':
              iconName = 'map-outline';
              break;
            case 'Earnings':
              iconName = 'cash-outline';
              break;
            case 'History':
              iconName = 'time-outline';
              break;
            case 'Chat':
              iconName = 'chatbubbles-outline';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 10, // Increased from 5
          paddingTop: 10, // Added to shift icons upward
          height: 80, // Increased from 60
        },
        tabBarLabelStyle: {
          fontSize: 13, // Added for visibility
          lineHeight: 16, // Added for readability
          marginBottom: 4, // Added to position labels
          numberOfLines: 1, // Added to prevent wrapping
          ellipsizeMode: 'tail', // Added to handle long text
        },
        headerRight: () =>
          route.name === 'Home' ? (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Tab.Screen
        name="Home"
        component={RiderHomeScreen}
        options={{ headerTitle: 'Dashboard' }}
      />
      <Tab.Screen
        name="LiveMap"
        component={RiderLiveMapScreen}
        options={{ 
          headerTitle: 'Live Map',
          tabBarLabel: 'Live Map'
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ headerTitle: 'Earnings' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerTitle: 'History' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerTitle: 'Chat' }}
      />
    </Tab.Navigator>
  );
}

export default function RiderTabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RiderMainTabs"
        component={RiderTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="RiderProfile"
        component={RiderProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={RiderChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen
        name="LiveMap"
        component={RiderLiveMapScreen}
        options={{ 
          title: 'Live Map',
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="RideRequestsScreen"
        component={RideRequestsScreen}
        options={{ 
          title: 'Ride Requests',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
});