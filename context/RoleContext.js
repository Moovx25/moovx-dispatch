// context/RoleContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { auth, db, updateRiderLocation, updateUserLocation, createRideRequest, logoutUser } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Alert } from 'react-native';

export const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};

export const RoleProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false); // ✅ Rider online status
  const [location, setLocation] = useState(null); // optional, for toggle update

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUserId(user?.uid || null);

      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const userRole = data.role === 'rider' ? 'RIDER' : 'USER';
          setRole(userRole);
        } else {
          await initializeUser(user.uid);
          setRole('USER');
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
        try {
          await initializeUser(user.uid);
          setRole('USER');
        } catch (initError) {
          console.error('Error initializing user:', initError);
          Alert.alert('Error', 'Failed to initialize user. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const initializeUser = async (uid) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), {
      role: 'user',
      createdAt: serverTimestamp(),
    });
  };

  const initializeRider = async (uid) => {
    if (!uid) return;
    await setDoc(doc(db, 'riders', uid), {
      isOnline: false,
      createdAt: serverTimestamp(),
    }, { merge: true });
  };

  const customSetRole = async (newRole) => {
    if (role === newRole) return;
    setRole(newRole);

    if (!userId) return;

    try {
      if (newRole === 'RIDER') await initializeRider(userId);
      else if (newRole === 'USER') await initializeUser(userId);
    } catch (error) {
      console.error('Error setting role in Firestore:', error);
      Alert.alert('Error', 'Failed to set role. Please try again.');
    }
  };

  // ✅ Toggle online/offline status for rider
  const toggleOnlineStatus = async () => {
    if (!userId) return;
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);

      // Send last known location or default to 0,0
      await updateRiderLocation(userId, {
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0
      }, newStatus);

      console.log(`Rider online status updated: ${newStatus}`);
    } catch (error) {
      console.error('Error toggling online status:', error);
      Alert.alert('Error', 'Failed to toggle online status');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUserId(null);
      setRole(null);
      setIsOnline(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const contextValue = useMemo(() => ({
    userId,
    role,
    setRole: customSetRole,
    loading,
    updateUserLocation,
    updateRiderLocation,
    createRideRequest,
    logout,
    isOnline,
    toggleOnlineStatus,
  }), [userId, role, loading, isOnline, location]);

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};
