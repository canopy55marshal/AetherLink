import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface FloatingMessageIconProps {
  unreadCount?: number;
}

export default function FloatingMessageIcon({ unreadCount = 0 }: FloatingMessageIconProps) {
  const router = useSafeRouter();
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    // 触发按压动画
    scale.value = withSpring(0.9);
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);

    router.push('/contacts');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Main Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome6 name="message" size={28} color="#FFFFFF" />
      </View>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <ThemedText variant="caption" color="#FFFFFF" style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </ThemedText>
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'web' ? 100 : 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 9999,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6584',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#F0F0F3',
    zIndex: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 12,
  },
});
