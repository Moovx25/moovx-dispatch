import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const QuickMessage = ({ visible, onClose, recipientName, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [selectedQuickMessage, setSelectedQuickMessage] = useState('');

  const quickMessages = [
    "I'm on my way",
    "Running 5 minutes late",
    "Arrived at pickup location",
    "Package delivered successfully",
    "Unable to find the address",
    "Customer not available",
    "Need assistance"
  ];

  const handleSendMessage = async () => {
    const messageToSend = selectedQuickMessage || message;
    if (!messageToSend.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      await onSendMessage(messageToSend);
      setMessage('');
      setSelectedQuickMessage('');
      onClose();
      Alert.alert('Success', 'Message sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Send Message to {recipientName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Quick Messages</Text>
          <View style={styles.quickMessages}>
            {quickMessages.map((quickMsg, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickMessageButton,
                  selectedQuickMessage === quickMsg && styles.selectedQuickMessage
                ]}
                onPress={() => setSelectedQuickMessage(quickMsg)}
              >
                <Text style={[
                  styles.quickMessageText,
                  selectedQuickMessage === quickMsg && styles.selectedQuickMessageText
                ]}>
                  {quickMsg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Custom Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
    marginTop: 10,
  },
  quickMessages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  quickMessageButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedQuickMessage: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickMessageText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedQuickMessageText: {
    color: colors.white,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  sendButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickMessage;