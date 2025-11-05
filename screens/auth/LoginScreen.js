import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import colors from '../../constants/colors';
import { RoleContext } from '../../context/RoleContext';
import { USER, RIDER } from '../../constants/roles';

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setRole } = useContext(RoleContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const selectedRole = route.params?.role;

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields.');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        return Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
      }

      // Fetch or set role in Firestore
      let firestoreRole = USER;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        firestoreRole = userDoc.data().role === 'rider' ? RIDER : USER;

        if (selectedRole && selectedRole !== firestoreRole) {
          await updateDoc(userRef, { role: selectedRole === RIDER ? 'rider' : 'user' });
          firestoreRole = selectedRole;
        }
      } else {
        await setDoc(userRef, {
          email: user.email,
          role: selectedRole === RIDER ? 'rider' : 'user',
          createdAt: serverTimestamp(),
        });
        firestoreRole = selectedRole;
      }

      setRole(firestoreRole);

      // Navigate to correct dashboard
      const target = firestoreRole === RIDER ? 'RiderTabs' : 'UserTabs';
      navigation.reset({ index: 0, routes: [{ name: target }] });
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <LinearGradient colors={['#0000ff', '#ff0000']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>

        <BlurView intensity={50} tint="light" style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </BlurView>

        <BlurView intensity={50} tint="light" style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </BlurView>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: 24, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  inputContainer: { width: '100%', marginBottom: 16, borderRadius: 10, overflow: 'hidden' },
  input: { height: 50, paddingHorizontal: 16, color: '#000' },
  forgotText: { color: '#fff', alignSelf: 'flex-end', marginBottom: 12, textDecorationLine: 'underline' },
  button: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, width: '100%' },
  buttonText: { color: '#000', textAlign: 'center', fontWeight: 'bold' },
  linkText: { color: '#fff', marginTop: 16, textDecorationLine: 'underline' },
});
