import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

export default function RegisterScreen() {
  const router = useSafeRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const styles = createStyles();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('提示', '请填写所有必填项');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      Alert.alert('提示', '密码长度至少为6位');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('注册失败', error.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.replace('/login');
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={goToLogin} style={styles.backButton}>
              <FontAwesome6 name="arrow-left" size={20} color="#636E72" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <ThemedText variant="h1" color="#2D3436" style={styles.title}>
              创建账号
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={styles.subtitle}>
              开启您的素养教育之旅
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="user" size={20} color="#B2BEC3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="用户名"
                  placeholderTextColor="#B2BEC3"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="envelope" size={20} color="#B2BEC3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="邮箱"
                  placeholderTextColor="#B2BEC3"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="lock" size={20} color="#B2BEC3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="密码（至少6位）"
                  placeholderTextColor="#B2BEC3"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome6
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#B2BEC3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="lock" size={20} color="#B2BEC3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="确认密码"
                  placeholderTextColor="#B2BEC3"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome6
                    name={showConfirmPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#B2BEC3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <ThemedText variant="bodyMedium" color="#FFFFFF" style={{ fontWeight: '600' }}>
                {loading ? '注册中...' : '注册'}
              </ThemedText>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <ThemedText variant="body" color="#636E72">
                已有账号？
              </ThemedText>
              <TouchableOpacity onPress={goToLogin}>
                <ThemedText variant="body" color="#6C63FF" style={{ fontWeight: '600' }}>
                  立即登录
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
