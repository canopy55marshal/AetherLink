import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket, Message } from '@/hooks/useSocket';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createStyles } from './styles';

export default function ChatScreen() {
  const router = useSafeRouter();
  const { user } = useAuth();
  const { contactId, contactName, contactAvatar } = useSafeSearchParams<{
    contactId: string;
    contactName: string;
    contactAvatar: string;
  }>();
  const styles = createStyles();
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // 使用 Socket.io
  const { isConnected, messages: socketMessages, joinRoom, leaveRoom, sendMessage } = useSocket();

  // 生成房间ID（使用两个用户ID的组合）
  const roomId = [String(user?.id || ''), contactId].sort().join('-');

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId]);

  // 合并本地消息和 Socket 消息
  const allMessages = [...localMessages, ...socketMessages];

  // 滚动到底部
  useEffect(() => {
    if (scrollViewRef.current && allMessages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]);

  const handleSendMessage = () => {
    if (inputText.trim() === '' || !user) return;

    // 通过 Socket 发送消息
    sendMessage(roomId, inputText, String(user.id), user.username || '我');

    // 本地显示
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      roomId,
      message: inputText,
      userId: String(user.id),
      userName: user.username || '我',
      timestamp: new Date().toISOString(),
    };

    setLocalMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
          </TouchableOpacity>
          <Image source={{ uri: contactAvatar }} style={styles.avatar} />
          <ThemedText variant="h3" color="#2D3436" style={styles.contactName}>
            {contactName}
          </ThemedText>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {allMessages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText variant="body" color="#B2BEC3">
                {isConnected ? '开始聊天吧！' : '连接中...'}
              </ThemedText>
            </View>
          ) : (
            allMessages.map((message) => {
              const isSent = message.userId === String(user?.id);
              const time = new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    isSent ? styles.sentMessage : styles.receivedMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isSent ? styles.sentBubble : styles.receivedBubble,
                    ]}
                  >
                    <ThemedText
                      variant="body"
                      color={isSent ? '#FFFFFF' : '#2D3436'}
                      style={styles.messageText}
                    >
                      {message.message}
                    </ThemedText>
                  </View>
                  <ThemedText variant="caption" color="#636E72" style={styles.messageTime}>
                    {time}
                  </ThemedText>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachButton}>
            <FontAwesome6 name="paperclip" size={20} color="#636E72" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="输入消息..."
            placeholderTextColor="#B2BEC3"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() !== '' && styles.sendButtonActive]}
            onPress={handleSendMessage}
            disabled={inputText.trim() === ''}
          >
            <FontAwesome6
              name="paper-plane"
              size={20}
              color={inputText.trim() !== '' ? '#FFFFFF' : '#B2BEC3'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
