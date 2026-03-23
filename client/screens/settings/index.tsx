import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Switch, Linking } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

export default function SettingsScreen() {
  const router = useSafeRouter();
  const { logout } = useAuth();
  const styles = createStyles();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = React.useState(true);

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

  const handleOpenPrivacyPolicy = () => {
    // 打开隐私政策页面
    Alert.alert('隐私政策', '这里是隐私政策内容');
  };

  const handleOpenTermsOfService = () => {
    // 打开服务条款页面
    Alert.alert('服务条款', '这里是服务条款内容');
  };

  const handleContactSupport = () => {
    // 联系客服
    Alert.alert('联系客服', '客服电话：400-888-8888\n邮箱：support@example.com');
  };

  const handleCheckUpdate = () => {
    // 检查更新
    Alert.alert('检查更新', '当前已是最新版本 v1.0.0');
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除缓存吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            Alert.alert('成功', '缓存已清除');
          },
        },
      ]
    );
  };

  const settingsGroups = [
    {
      title: '通用设置',
      items: [
        {
          icon: 'bell',
          title: '消息通知',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: 'moon',
          title: '深色模式',
          type: 'switch',
          value: darkModeEnabled,
          onValueChange: setDarkModeEnabled,
        },
        {
          icon: 'play',
          title: '视频自动播放',
          type: 'switch',
          value: autoPlayEnabled,
          onValueChange: setAutoPlayEnabled,
        },
      ],
    },
    {
      title: '存储与数据',
      items: [
        {
          icon: 'trash',
          title: '清除缓存',
          type: 'action',
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: '关于',
      items: [
        {
          icon: 'code-branch',
          title: '检查更新',
          type: 'action',
          onPress: handleCheckUpdate,
        },
        {
          icon: 'shield',
          title: '隐私政策',
          type: 'action',
          onPress: handleOpenPrivacyPolicy,
        },
        {
          icon: 'file-contract',
          title: '服务条款',
          type: 'action',
          onPress: handleOpenTermsOfService,
        },
        {
          icon: 'headset',
          title: '联系客服',
          type: 'action',
          onPress: handleContactSupport,
        },
      ],
    },
  ];

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h3" color="#2D3436" style={styles.headerTitle}>
            设置
          </ThemedText>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.section}>
            <ThemedText variant="caption" color="#636E72" style={styles.sectionTitle}>
              {group.title}
            </ThemedText>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 && styles.settingItemLast,
                  ]}
                >
                  <View style={styles.settingLeft}>
                    <FontAwesome6 name={item.icon as any} size={20} color="#6C63FF" />
                    <ThemedText variant="body" color="#2D3436" style={styles.settingTitle}>
                      {item.title}
                    </ThemedText>
                  </View>
                  {item.type === 'switch' ? (
                    <Switch
                      value={(item as any).value}
                      onValueChange={(item as any).onValueChange}
                      trackColor={{ false: '#E8E8EB', true: '#6C63FF' }}
                      thumbColor={(item as any).value ? '#FFFFFF' : '#FFFFFF'}
                    />
                  ) : (
                    <TouchableOpacity onPress={(item as any).onPress}>
                      <FontAwesome6 name="chevron-right" size={16} color="#B2BEC3" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

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
