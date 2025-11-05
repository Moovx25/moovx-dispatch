import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent.');
      console.log('Navigating back to LoginScreen');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Password reset error:', error.message);
    }
  };

  return (
    <LinearGradient colors={['#0000ff', '#ff0000']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.label}>Enter your registered email:</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>← Back to Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});