import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

export default function LoginScreen() {
  const router = useSafeRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const styles = createStyles();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('提示', '请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('登录失败', error.message || '用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <FontAwesome6 name="atom" size={48} color="#6C63FF" />
            </View>
            <ThemedText variant="h1" color="#2D3436" style={styles.title}>
              未来核心资源
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={styles.subtitle}>
              素养教育平台
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="lock" size={20} color="#B2BEC3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="密码"
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

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <ThemedText variant="bodyMedium" color="#FFFFFF" style={{ fontWeight: '600' }}>
                {loading ? '登录中...' : '登录'}
              </ThemedText>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <ThemedText variant="body" color="#636E72">
                还没有账号？
              </ThemedText>
              <TouchableOpacity onPress={goToRegister}>
                <ThemedText variant="body" color="#6C63FF" style={{ fontWeight: '600' }}>
                  立即注册
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
