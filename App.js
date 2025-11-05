import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RoleProvider } from './context/RoleContext'; // Adjust path if needed
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RoleProvider>
    </ErrorBoundary>
  );
}