import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatBubble = ({ message, isSender }) => (
  <View style={[styles.bubble, isSender ? styles.sender : styles.receiver]}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: { padding: 10, borderRadius: 16, marginVertical: 4, maxWidth: '80%' },
  sender: { backgroundColor: '#007bff', alignSelf: 'flex-end' },
  receiver: { backgroundColor: '#e5e5ea', alignSelf: 'flex-start' },
  text: { color: '#fff' },
});

export default ChatBubble; 