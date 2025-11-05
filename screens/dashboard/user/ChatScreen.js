import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ChatBubble from '../../../components/ChatBubble';
import Button from '../../../components/Button';
import colors from '../../../constants/colors';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', isSender: false },
    { id: 2, text: 'I need help with my recent ride', isSender: true },
    { id: 3, text: 'Sure! What seems to be the issue?', isSender: false },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Add message to chat
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Support</Text>
        <Text style={styles.subtitle}>We're here to help</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.text}
            isSender={msg.isSender}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default ChatScreen; 