import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const Button = ({ title, onPress, disabled = false, style }) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      disabled && styles.buttonDisabled,
      style
    ]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { 
    padding: 16, 
    backgroundColor: colors.primary, 
    borderRadius: 8, 
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.secondary,
  },
  text: { 
    color: colors.white, 
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDisabled: {
    opacity: 0.6,
  },
});

export default Button; 