import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F0F0F3',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: Platform.OS === 'web' ? 70 : 60 + insets.bottom,
          paddingBottom: Platform.OS === 'web' ? 12 : insets.bottom + 8,
          paddingTop: 12,
          shadowColor: '#D1D9E6',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 6,
        },
        tabBarItemStyle: {
          height: Platform.OS === 'web' ? 70 : undefined,
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#B2BEC3',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: '认知馆',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="book-open" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-workshop"
        options={{
          title: '数据制作',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="cube" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pet"
        options={{
          title: '爱宠',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="paw" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '社区',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="people-group" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
