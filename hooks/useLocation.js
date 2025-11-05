// hooks/useLocation.js
import { useState, useEffect, useRef, useContext } from 'react';
import * as Location from 'expo-location';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { RoleContext } from '../context/RoleContext';
import { Alert } from 'react-native';

export const useLocation = () => {
  const { role, userId } = useContext(RoleContext);
  const [location, setLocation] = useState(null);
  const [shouldTrack, setShouldTrack] = useState(false);
  const watchRef = useRef(null);
  const lastWriteRef = useRef(0);

  useEffect(() => {
    if (!userId || role !== 'RIDER') return;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Enable location for live tracking.');
          return;
        }

        // Try to get an accurate initial location
        let initialLocation = null;
        for (let i = 0; i < 5; i++) {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          if (pos.coords.accuracy <= 30) { // Only accept <30m accuracy
            initialLocation = pos.coords;
            break;
          }
        }

        if (!initialLocation) {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
          initialLocation = pos.coords;
        }

        setLocation(initialLocation);
        sendLocationToFirestore(initialLocation);

        // Watch location with throttling
        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 5,
            timeInterval: 4000,
          },
          async (pos) => {
            if (!shouldTrack) return;
            const { coords } = pos;

            // Only accept accurate locations
            if (coords.accuracy > 50) return;

            setLocation(coords);

            const now = Date.now();
            if (now - lastWriteRef.current > 6000) {
              lastWriteRef.current = now;
              sendLocationToFirestore(coords);
            }
          }
        );
      } catch (e) {
        console.log("Tracking error:", e);
      }
    };

    if (shouldTrack && !watchRef.current) startTracking();
    if (!shouldTrack && watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }

    return () => {
      if (watchRef.current) {
        watchRef.current.remove();
        watchRef.current = null;
      }
    };
  }, [shouldTrack, userId, role]);

  const sendLocationToFirestore = async (coords) => {
    try {
      if (!userId) return;
      await updateDoc(doc(db, 'riders', userId), {
        lastLocation: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          updatedAt: serverTimestamp(),
        },
      });
    } catch (e) {
      console.log("Failed Firestore location update:", e);
    }
  };

  return {
    location,
    setShouldTrack,
  };
};
