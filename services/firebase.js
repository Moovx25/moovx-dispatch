import { initializeApp } from 'firebase/app';
import { 
  getFirestore, doc, setDoc, updateDoc, getDoc, collection, onSnapshot,
  serverTimestamp, query, where, getDocs
} from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyCYd3j3Wnf6V6qw37CvkJjp2FmCaDy3t6o",
  authDomain: "moovx-dispatch-b649d.firebaseapp.com",
  projectId: "moovx-dispatch-b649d",
  storageBucket: "moovx-dispatch-b649d.firebasestorage.app",
  messagingSenderId: "47434222508",
  appId: "1:47434222508:web:68885b0d59ecc5096a0809",
  measurementId: "G-5NMV37T21N"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);

// --- Initialize Auth ---
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// --- Firestore ---
const db = getFirestore(app);

// ---------------- User & Rider Initialization ----------------
export async function initializeUser(userId, role = 'user') {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, { role, createdAt: serverTimestamp() });
      console.log(`User ${userId} initialized as ${role}`);
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
}

export async function initializeRider(userId) {
  try {
    const riderRef = doc(db, 'riders', userId);
    const riderDoc = await getDoc(riderRef);
    if (!riderDoc.exists()) {
      await setDoc(riderRef, {
        isOnline: false,
        createdAt: serverTimestamp()
      });
      console.log(`Rider ${userId} initialized`);
    }
  } catch (error) {
    console.error('Error initializing rider:', error);
    throw error;
  }
}

// ---------------- Location & Online Status ----------------
export async function updateRiderLocation(userId, location, isOnline) {
  if (!userId || !location) return;
  try {
    await updateDoc(doc(db, 'riders', userId), {
      lastLocation: { latitude: location.latitude, longitude: location.longitude, timestamp: serverTimestamp() },
      ...(isOnline !== undefined ? { isOnline } : {})
    });
    console.log('Rider location updated');
  } catch (error) {
    console.error('Error updating rider location:', error);
    Alert.alert('Error', 'Failed to update rider location.');
  }
}

export async function setRiderOnlineStatus(userId, isOnline) {
  if (!userId) return;
  try {
    await updateDoc(doc(db, 'riders', userId), {
      isOnline,
      timestamp: serverTimestamp()
    });
    console.log('Rider online status updated');
  } catch (error) {
    console.error('Error setting rider online status:', error);
    Alert.alert('Error', 'Failed to update online status.');
  }
}

export async function updateUserLocation(userId, location) {
  if (!userId || !location) return;
  try {
    await updateDoc(doc(db, 'users', userId), {
      lastLocation: { latitude: location.latitude, longitude: location.longitude, timestamp: serverTimestamp() }
    });
    console.log('User location updated');
  } catch (error) {
    console.error('Error updating user location:', error);
    Alert.alert('Error', 'Failed to update user location.');
  }
}

// ---------------- Ride Management ----------------
export async function createRideRequest(rideData) {
  try {
    const rideRef = doc(collection(db, 'rides'));
    await setDoc(rideRef, { ...rideData, rideId: rideRef.id, createdAt: serverTimestamp() });
    console.log('Ride request created with ID:', rideRef.id);
    return rideRef.id;
  } catch (error) {
    console.error('Error creating ride request:', error);
    throw error;
  }
}

export function listenToRideUpdates(rideId, callback) {
  const rideRef = doc(db, 'rides', rideId);
  return onSnapshot(rideRef, snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}

// ---------------- Utility Functions ----------------
export function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2) return null;
  const R = 6371;
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // meters
}

export function isRiderNearby(riderLocation, targetLocation, radius = 1000) {
  const distance = calculateDistance(riderLocation, targetLocation);
  return distance !== null && distance <= radius;
}

export async function getNearbyRiders(targetLocation, radius = 5000) {
  if (!targetLocation) return [];
  try {
    const q = query(collection(db, 'riders'), where('isOnline', '==', true));
    const snapshot = await getDocs(q);
    const nearby = [];
    snapshot.forEach(docSnap => {
      const rider = docSnap.data();
      if (rider.lastLocation && isRiderNearby(rider.lastLocation, targetLocation, radius)) {
        nearby.push({ id: docSnap.id, ...rider });
      }
    });
    nearby.sort((a, b) => calculateDistance(a.lastLocation, targetLocation) - calculateDistance(b.lastLocation, targetLocation));
    return nearby;
  } catch (error) {
    console.error('Error fetching nearby riders:', error);
    return [];
  }
}

// ---------------- Logout ----------------
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// ---------------- Exports ----------------
export {
  db,
  auth,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  getDocs
};
