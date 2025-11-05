import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import * as Location from 'expo-location'; // Added: For location permissions and services
import { Alert } from 'react-native'; // Added: For user alerts

// Update rider location in Firestore
export async function updateRiderLocation(userId, location, isOnline) {
  try {
    console.log('Updating rider location:', { userId, location, isOnline });
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Added: Check if user has 'rider' role
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists() || userDoc.data().role !== 'rider') {
      console.log('Non-rider user, skipping location update.');
      return;
    }

    // Added: Check location permissions and services
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      Alert.alert('Permission Required', 'Please enable location permissions in your device settings.');
      return;
    }

    const locationEnabled = await Location.hasServicesEnabledAsync();
    if (!locationEnabled) {
      console.error('Location services not enabled');
      Alert.alert('Location Services Disabled', 'Please enable location services on your device.');
      return;
    }

    const updateData = {
      userId,
      timestamp: serverTimestamp(),
    };
    
    if (location) {
      updateData.lastLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
    
    if (isOnline !== undefined) {
      updateData.isOnline = isOnline;
    }
    
    await setDoc(doc(db, 'riders', userId), updateData, { merge: true });
    console.log('Rider location updated in Firestore');
  } catch (error) {
    console.error('Error updating rider location:', error);
    // Modified: Improved error handling for user feedback
    Alert.alert('Error', 'Failed to update rider location. Please check your settings and try again.');
    throw error;
  }
}

// Update user location in Firestore
export async function updateUserLocation(userId, location) {
  try {
    console.log('Updating user location:', { userId, location });
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Added: Check if user has 'user' role (optional, depending on app requirements)
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists() || userDoc.data().role !== 'user') {
      console.log('Non-user role, skipping user location update.');
      return;
    }

    // Added: Check location permissions and services
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      Alert.alert('Permission Required', 'Please enable location permissions in your device settings.');
      return;
    }

    const locationEnabled = await Location.hasServicesEnabledAsync();
    if (!locationEnabled) {
      console.error('Location services not enabled');
      Alert.alert('Location Services Disabled', 'Please enable location services on your device.');
      return;
    }

    const updateData = {
      timestamp: serverTimestamp(),
    };
    
    if (location) {
      updateData.lastLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
    
    await updateDoc(doc(db, 'users', userId), updateData);
    console.log('User location updated in Firestore');
  } catch (error) {
    console.error('Error updating user location:', error);
    // Modified: Improved error handling for user feedback
    Alert.alert('Error', 'Failed to update user location. Please check your settings and try again.');
    throw error;
  }
}

// Set rider online status
export async function setRiderOnlineStatus(userId, isOnline) {
  try {
    console.log('Setting rider online status:', { userId, isOnline });
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Added: Check if user has 'rider' role
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists() || userDoc.data().role !== 'rider') {
      console.log('Non-rider user, skipping online status update.');
      return;
    }

    await updateDoc(doc(db, 'riders', userId), {
      isOnline,
      timestamp: serverTimestamp(),
    });
    
    console.log('Rider online status updated in Firestore');
  } catch (error) {
    console.error('Error setting rider online status:', error);
    // Modified: Improved error handling for user feedback
    Alert.alert('Error', 'Failed to update rider online status. Please try again.');
    throw error;
  }
}

// Get rider location
export async function getRiderLocation(userId) {
  try {
    console.log('Getting rider location for:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const riderDoc = await getDoc(doc(db, 'riders', userId)); // Fixed: Corrected doc().get() to getDoc()
    
    if (!riderDoc.exists()) {
      console.log('Rider document not found');
      return null;
    }
    
    const riderData = riderDoc.data();
    console.log('Rider data:', riderData);
    
    return riderData.lastLocation || null;
  } catch (error) {
    console.error('Error getting rider location:', error);
    throw error;
  }
}

// Get user location
export async function getUserLocation(userId) {
  try {
    console.log('Getting user location for:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const userDoc = await getDoc(doc(db, 'users', userId)); // Fixed: Corrected doc().get() to getDoc()
    
    if (!userDoc.exists()) {
      console.log('User document not found');
      return null;
    }
    
    const userData = userDoc.data();
    console.log('User data:', userData);
    
    return userData.lastLocation || null;
  } catch (error) {
    console.error('Error getting user location:', error);
    throw error;
  }
}

// Calculate distance between two locations
export function calculateDistance(location1, location2) {
  if (!location1 || !location2) {
    return null;
  }
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (location2.latitude - location1.latitude) * Math.PI / 180;
  const dLon = (location2.longitude - location1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(location1.latitude * Math.PI / 180) * Math.cos(location2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance * 1000; // Return distance in meters
}

// Check if a rider is within a certain radius of a location
export function isRiderNearby(riderLocation, targetLocation, radiusInMeters = 1000) {
  const distance = calculateDistance(riderLocation, targetLocation);
  return distance !== null && distance <= radiusInMeters;
}

// Get nearby riders
export async function getNearbyRiders(targetLocation, radiusInMeters = 5000) {
  try {
    console.log('Getting nearby riders for location:', targetLocation);
    
    if (!targetLocation) {
      throw new Error('Target location is required');
    }

    // Added: Check if user has 'rider' role (assuming called by rider or admin)
    const user = auth.currentUser; // Assuming auth is imported from firebase.js
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'rider') {
        console.log('Non-rider user, skipping nearby riders query.');
        return [];
      }
    }

    // Fixed: Corrected Firestore query syntax
    const ridersSnapshot = await getDocs(query(collection(db, 'riders'), where('isOnline', '==', true)));
    
    const nearbyRiders = [];
    
    ridersSnapshot.forEach(doc => {
      const riderData = doc.data();
      
      if (riderData.lastLocation) {
        const distance = calculateDistance(
          { 
            latitude: riderData.lastLocation.latitude, 
            longitude: riderData.lastLocation.longitude 
          },
          targetLocation
        );
        
        if (distance !== null && distance <= radiusInMeters) {
          nearbyRiders.push({
            id: doc.id,
            ...riderData,
            distance
          });
        }
      }
    });
    
    // Sort by distance
    nearbyRiders.sort((a, b) => a.distance - b.distance);
    
    console.log('Found', nearbyRiders.length, 'nearby riders');
    
    return nearbyRiders;
  } catch (error) {
    console.error('Error getting nearby riders:', error);
    // Modified: Improved error handling for user feedback
    if (error.code === 'permission-denied') {
      Alert.alert('Error', 'You do not have permission to view nearby riders.');
    } else {
      Alert.alert('Error', 'Failed to fetch nearby riders. Please try again.');
    }
    throw error;
  }
}

// Added: Import auth for role checks
import { auth, getDocs, query } from 'firebase/firestore';