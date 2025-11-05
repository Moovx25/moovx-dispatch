// screens/auth/RoleSelectScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { USER, RIDER } from '../../constants/roles';
import Card from '../../components/Card';
import colors from '../../constants/colors';
import { useRole } from '../../context/RoleContext';

const RoleSelectScreen = ({ navigation }) => {
  const { setRole, userId } = useRole();

  const handleRoleSelect = (role) => {
    // Set the role in the context temporarily
    setRole(role);
    
    // Always navigate to Login with the selected role
    navigation.navigate('Login', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>How will you use Moovx Dispatch?</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => handleRoleSelect(USER)}
        >
          <Card style={styles.card}>
            <Text style={styles.roleTitle}>👤 User</Text>
            <Text style={styles.roleDescription}>
              Book rides and get transported to your destination
            </Text>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => handleRoleSelect(RIDER)}
        >
          <Card style={styles.card}>
            <Text style={styles.roleTitle}>🏍️ Rider</Text>
            <Text style={styles.roleDescription}>
              Accept ride requests and earn money
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  roleContainer: {
    gap: 20,
  },
  roleCard: {
    marginBottom: 16,
  },
  card: {
    padding: 24,
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  roleDescription: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default RoleSelectScreen;