import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import colors from '../../../constants/colors';

const EarningsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [earnings] = useState({
    today: { amount: 2500, rides: 8, hours: 6 },
    week: { amount: 15000, rides: 45, hours: 42 },
    month: { amount: 65000, rides: 180, hours: 168 },
  });

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const currentEarnings = earnings[selectedPeriod];

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Earnings',
      `Withdraw ₦${currentEarnings.amount} to your bank account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Withdraw', 
          onPress: () => {
            console.log('Withdrawing:', currentEarnings.amount);
            Alert.alert('Success', 'Withdrawal initiated successfully');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Earnings</Text>
        <Text style={styles.subtitle}>Track your income</Text>
      </View>

      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.selectedPeriod,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period.id && styles.selectedPeriodText,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.earningsCard}>
        <Text style={styles.earningsAmount}>₦{currentEarnings.amount.toLocaleString()}</Text>
        <Text style={styles.earningsLabel}>Total Earnings</Text>
      </Card>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{currentEarnings.rides}</Text>
          <Text style={styles.statLabel}>Rides</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{currentEarnings.hours}h</Text>
          <Text style={styles.statLabel}>Hours</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            ₦{Math.round(currentEarnings.amount / currentEarnings.rides)}
          </Text>
          <Text style={styles.statLabel}>Avg/Ride</Text>
        </Card>
      </View>

      <Card style={styles.withdrawalCard}>
        <Text style={styles.sectionTitle}>Withdraw Earnings</Text>
        <Text style={styles.withdrawalText}>
          Available for withdrawal: ₦{currentEarnings.amount.toLocaleString()}
        </Text>
        <Button
          title="Withdraw to Bank"
          onPress={handleWithdraw}
          style={styles.withdrawButton}
        />
      </Card>

      <Card style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Earnings Tips</Text>
        <Text style={styles.tipText}>• Peak hours: 7-9 AM, 5-7 PM</Text>
        <Text style={styles.tipText}>• Weekend rates are higher</Text>
        <Text style={styles.tipText}>• Maintain 4.5+ star rating</Text>
        <Text style={styles.tipText}>• Complete bonus challenges</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  selectedPeriod: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  selectedPeriodText: {
    color: colors.white,
  },
  earningsCard: {
    margin: 20,
    marginTop: 0,
    alignItems: 'center',
    padding: 24,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  earningsLabel: {
    fontSize: 16,
    color: colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondary,
  },
  withdrawalCard: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  withdrawalText: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 16,
  },
  withdrawButton: {
    width: '100%',
  },
  tipsCard: {
    margin: 20,
    marginTop: 0,
  },
  tipText: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
});

export default EarningsScreen; 