import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { app } from '../../services/firebase';

const SignupScreen = () => {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSignup = async () => {
    if (!email || !fullName || !phone || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    if (role === 'rider' && (!licenseNumber || !vehicleNumber)) {
      Alert.alert('Missing fields', 'Please enter license and vehicle number.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const userData = {
        uid: user.uid,
        email: user.email,
        fullName,
        phone,
        role,
        createdAt: new Date().toISOString(),
      };

      if (role === 'rider') {
        userData.licenseNumber = licenseNumber;
        userData.vehicleNumber = vehicleNumber;
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      console.log('User signed up with role:', role); // Add logging
      Alert.alert('Verify your email', 'A verification email has been sent.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error.message); // Add logging
      Alert.alert('Signup error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ff416c', '#004e92']} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#ccc"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#fff"
              onPress={() => console.log('Icon used:', showPassword ? 'visibility' : 'visibility-off')} // Add logging
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#ccc"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <MaterialIcons
              name={showConfirm ? 'visibility' : 'visibility-off'}
              size={24}
              color="#fff"
              onPress={() => console.log('Icon used:', showConfirm ? 'visibility' : 'visibility-off')} // Add logging
            />
          </TouchableOpacity>
        </View>

        {role === 'rider' && (
          <>
            <TextInput
              placeholder="License Number"
              placeholderTextColor="#ccc"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              style={styles.input}
            />
            <TextInput
              placeholder="Vehicle Number"
              placeholderTextColor="#ccc"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              style={styles.input}
            />
          </>
        )}

        <View style={styles.roleContainer}>
          <TouchableOpacity onPress={() => setRole('user')}>
            <Text style={[styles.roleText, role === 'user' && styles.roleSelected]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole('rider')}>
            <Text style={[styles.roleText, role === 'rider' && styles.roleSelected]}>Rider</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    marginTop: Platform.OS === 'android' ? 80 : 140,
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#e94057',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  roleText: {
    color: '#ccc',
    fontSize: 16,
  },
  roleSelected: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;