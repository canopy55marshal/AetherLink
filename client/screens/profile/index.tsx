import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createStyles } from './styles';

export default function ProfileScreen() {
  const router = useSafeRouter();
  const { user, logout } = useAuth();
  const styles = createStyles();

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('退出失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'user',
      title: '个人资料',
      color: '#6C63FF',
      onPress: () => router.push('/profile-edit'),
    },
    {
      icon: 'book-bookmark',
      title: '我的学习',
      color: '#00B894',
      onPress: () => Alert.alert('提示', '学习记录功能即将上线'),
    },
    {
      icon: 'heart',
      title: '我的收藏',
      color: '#FF7675',
      onPress: () => Alert.alert('提示', '收藏功能即将上线'),
    },
    {
      icon: 'clock-rotate-left',
      title: '浏览历史',
      color: '#FDCB6E',
      onPress: () => Alert.alert('提示', '浏览历史功能即将上线'),
    },
    {
      icon: 'gear',
      title: '设置',
      color: '#636E72',
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'circle-question',
      title: '帮助与反馈',
      color: '#74B9FF',
      onPress: () => Alert.alert('提示', '帮助中心即将上线'),
    },
    {
      icon: 'info-circle',
      title: '关于我们',
      color: '#A29BFE',
      onPress: () => Alert.alert('关于我们', '未来核心资源素养教育平台\n版本 1.0.0'),
    },
  ];

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <FontAwesome6 name="user" size={40} color="#6C63FF" />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <ThemedText variant="h3" color="#2D3436" style={styles.username}>
              {user?.username || '未登录'}
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={styles.email}>
              {user?.email || ''}
            </ThemedText>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile-edit')}>
            <FontAwesome6 name="pen-to-square" size={20} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText variant="h3" color="#2D3436" style={styles.statNumber}>
              0
            </ThemedText>
            <ThemedText variant="caption" color="#636E72">
              学习时长
            </ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText variant="h3" color="#2D3436" style={styles.statNumber}>
              0
            </ThemedText>
            <ThemedText variant="caption" color="#636E72">
              完成任务
            </ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText variant="h3" color="#2D3436" style={styles.statNumber}>
              0
            </ThemedText>
            <ThemedText variant="caption" color="#636E72">
              获得证书
            </ThemedText>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <FontAwesome6 name={item.icon as any} size={20} color={item.color} />
              </View>
              <ThemedText variant="body" color="#2D3436" style={styles.menuTitle}>
                {item.title}
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color="#B2BEC3" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText variant="bodyMedium" color="#FFFFFF" style={{ fontWeight: '600' }}>
            退出登录
          </ThemedText>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <ThemedText variant="caption" color="#B2BEC3">
            未来核心资源素养教育平台 v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
