import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8, // Reduced from 16
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 4, // Reduced from 8
  },
});

export default Card;