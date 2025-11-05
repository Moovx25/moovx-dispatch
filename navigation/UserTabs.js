import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UserHomeScreen from '../screens/dashboard/user/UserHomeScreen';
import HistoryScreen from '../screens/dashboard/user/HistoryScreen';
import SettingsScreen from '../screens/dashboard/user/SettingsScreen';
import WalletScreen from '../screens/dashboard/user/WalletScreen';
import BookingScreen from '../screens/dashboard/user/BookingScreen'; // optional tab if you want direct access

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#555',
      }}
    >
      <Tab.Screen
        name="Home"
        component={UserHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
