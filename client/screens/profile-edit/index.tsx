import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createFormDataFile } from '@/utils';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

export default function ProfileEditScreen() {
  const router = useSafeRouter();
  const { user, token } = useAuth();
  const styles = createStyles();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState((user as any)?.bio || '');
  const [avatarUri, setAvatarUri] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  // 请求相册权限
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '权限请求',
          '需要相册权限才能上传头像',
          [{ text: '确定' }]
        );
      }
    })();
  }, []);

  const handlePickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('错误', '选择图片失败');
    }
  }, []);

  const handleSave = useCallback(async () => {
    // 验证输入
    if (!username.trim()) {
      Alert.alert('提示', '用户名不能为空');
      return;
    }

    if (username.length < 3) {
      Alert.alert('提示', '用户名长度至少为3位');
      return;
    }

    if (!email.trim()) {
      Alert.alert('提示', '邮箱不能为空');
      return;
    }

    // 简单的邮箱验证：必须包含 @ 和 .，且 @ 在 . 之前
    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    const atBeforeDot = email.indexOf('@') < email.lastIndexOf('.');
    const isValidEmail = hasAt && hasDot && atBeforeDot;

    if (!isValidEmail) {
      Alert.alert('提示', '邮箱格式不正确');
      return;
    }

    setLoading(true);

    try {
      // 1. 如果修改了头像，先上传头像
      if (avatarUri && avatarUri.startsWith('file://')) {
        const formData = new FormData();
        const file = await createFormDataFile(avatarUri, 'avatar.jpg', 'image/jpeg');
        formData.append('avatar', file as any);

        const uploadResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/avatar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || '头像上传失败');
        }
      }

      // 2. 更新用户信息
      const updateData: any = {};

      if (username !== user?.username) {
        updateData.username = username;
      }

      if (email !== user?.email) {
        updateData.email = email;
      }

      if (bio !== (user as any)?.bio) {
        updateData.bio = bio;
      }

      // 只有当有变化时才更新
      if (Object.keys(updateData).length > 0) {
        const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '更新失败');
        }
      }

      Alert.alert('成功', '个人资料已更新', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('错误', error.message || '保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [username, email, bio, avatarUri, token, user?.username, user?.email, user?.avatar, (user as any)?.bio, router]);

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
            </TouchableOpacity>
            <ThemedText variant="h3" color="#2D3436">
              编辑个人资料
            </ThemedText>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
              disabled={loading}
            >
              <ThemedText
                variant="bodyMedium"
                color={loading ? '#B2BEC3' : '#6C63FF'}
                style={{ fontWeight: '600' }}
              >
                {loading ? '保存中...' : '保存'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Avatar Section */}
          <View style={styles.section}>
            <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <FontAwesome6 name="user" size={48} color="#6C63FF" />
                </View>
              )}
              <View style={styles.avatarEdit}>
                <FontAwesome6 name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <ThemedText variant="caption" color="#636E72" style={styles.avatarHint}>
              点击头像可更换图片
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.section}>
            {/* Username */}
            <View style={styles.fieldContainer}>
              <ThemedText variant="body" color="#2D3436" style={styles.label}>
                用户名
              </ThemedText>
              <View style={styles.inputContainer}>
                <RNTextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="请输入用户名"
                  placeholderTextColor="#B2BEC3"
                  maxLength={50}
                  autoCapitalize="none"
                />
              </View>
              <ThemedText variant="caption" color="#B2BEC3">
                3-50个字符，用户名将用于展示
              </ThemedText>
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <ThemedText variant="body" color="#2D3436" style={styles.label}>
                邮箱
              </ThemedText>
              <View style={styles.inputContainer}>
                <RNTextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="请输入邮箱"
                  placeholderTextColor="#B2BEC3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <ThemedText variant="caption" color="#B2BEC3">
                用于找回密码和接收通知
              </ThemedText>
            </View>

            {/* Bio */}
            <View style={styles.fieldContainer}>
              <ThemedText variant="body" color="#2D3436" style={styles.label}>
                个人简介
              </ThemedText>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <RNTextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="介绍一下自己吧..."
                  placeholderTextColor="#B2BEC3"
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                />
              </View>
              <ThemedText variant="caption" color="#B2BEC3">
                {bio.length}/200
              </ThemedText>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <FontAwesome6 name="circle-info" size={16} color="#6C63FF" />
            <ThemedText variant="caption" color="#636E72" style={styles.tipsText}>
              用户名和邮箱修改后需要重新登录
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
