import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import colors from '../../../constants/colors';

const WalletScreen = () => {
  const [balance, setBalance] = useState(2500);
  const [transactions] = useState([
    { id: 1, type: 'credit', amount: 1000, description: 'Added money', date: 'Today' },
    { id: 2, type: 'debit', amount: 500, description: 'Ride payment', date: 'Yesterday' },
    { id: 3, type: 'credit', amount: 2000, description: 'Added money', date: '2 days ago' },
  ]);

  const handleAddMoney = () => {
    Alert.alert('Add Money', 'This will redirect to payment gateway');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
        <Button
          title="Add Money"
          onPress={handleAddMoney}
          style={styles.addMoneyButton}
        />
      </Card>

      <Card style={styles.transactionsCard}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>
                {transaction.description}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === 'credit' ? styles.credit : styles.debit,
              ]}
            >
              {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount}
            </Text>
          </View>
        ))}
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
  balanceCard: {
    margin: 20,
    marginTop: 0,
    alignItems: 'center',
    padding: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  addMoneyButton: {
    width: '100%',
  },
  transactionsCard: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  credit: {
    color: '#28a745',
  },
  debit: {
    color: '#dc3545',
  },
});

export default WalletScreen; 