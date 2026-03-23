import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createStyles } from './styles';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: '美食博主小美',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    lastMessage: '那个红烧肉的做法明天发给你哈',
    lastMessageTime: '刚刚',
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: 'contact-2',
    name: '摄影师阿杰',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    lastMessage: '周末一起出去拍照吧',
    lastMessageTime: '10分钟前',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'contact-3',
    name: '健身教练大强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    lastMessage: '记得今天要完成腿部训练哦',
    lastMessageTime: '1小时前',
    unreadCount: 2,
    isOnline: false,
  },
  {
    id: 'contact-4',
    name: '旅行达人',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    lastMessage: '下次去哪里玩呢？',
    lastMessageTime: '昨天',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'contact-5',
    name: '读书会会长',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    lastMessage: '下周的书目定了吗？',
    lastMessageTime: '昨天',
    unreadCount: 1,
    isOnline: true,
  },
];

export default function ContactsScreen() {
  const router = useSafeRouter();
  const styles = createStyles();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchText, setSearchText] = useState('');

  const handleContactPress = (contact: Contact) => {
    router.push('/chat', {
      contactId: contact.id,
      contactName: contact.name,
      contactAvatar: contact.avatar,
    });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setContacts(mockContacts);
    } else {
      const filtered = mockContacts.filter(contact =>
        contact.name.toLowerCase().includes(text.toLowerCase())
      );
      setContacts(filtered);
    }
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
          </TouchableOpacity>
          <ThemedText variant="h2" color="#2D3436" style={styles.title}>
            通讯录
          </ThemedText>
        </View>
        <ThemedText variant="body" color="#636E72" style={styles.subtitle}>
          {contacts.length} 位好友
        </ThemedText>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesome6 name="magnifying-glass" size={16} color="#636E72" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索好友"
            placeholderTextColor="#B2BEC3"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        {/* Contacts List */}
        <ScrollView style={styles.contactsList}>
          {contacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactItem}
              onPress={() => handleContactPress(contact)}
              activeOpacity={0.7}
            >
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                {contact.isOnline && <View style={styles.onlineIndicator} />}
              </View>

              {/* Contact Info */}
              <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                  <ThemedText variant="body" color="#2D3436" style={styles.contactName}>
                    {contact.name}
                  </ThemedText>
                  <ThemedText variant="caption" color="#636E72">
                    {contact.lastMessageTime}
                  </ThemedText>
                </View>
                <View style={styles.contactMeta}>
                  <ThemedText variant="caption" color="#636E72" style={styles.lastMessage}>
                    {contact.lastMessage}
                  </ThemedText>
                  {contact.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <ThemedText variant="caption" color="#FFFFFF" style={styles.unreadText}>
                        {contact.unreadCount}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}
