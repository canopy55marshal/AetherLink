import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 动态加载屏幕组件
 * 显示旋转动画和加载状态，让用户知道应用正在加载
 */
export default function LoadingScreen() {
  const { theme, isDark } = useTheme();
  const [progressText, setProgressText] = useState('正在初始化...');

  // 旋转动画值
  const rotation = useSharedValue(0);

  // 脉冲缩放动画值
  const pulseScale = useSharedValue(1);

  // 启动旋转动画
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, []);

  // 动态更新加载文本
  useEffect(() => {
    const texts = [
      '正在初始化...',
      '加载认证信息...',
      '准备应用界面...',
      '即将完成...',
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setProgressText(texts[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 旋转动画样式
  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // 脉冲动画样式
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={styles.content}>
        {/* 脉冲圆环背景 */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              borderColor: theme.primary,
            },
            pulseStyle,
          ]}
        />

        {/* 旋转加载器 */}
        <Animated.View style={[styles.loaderContainer, rotationStyle]}>
          <View style={[styles.loaderCircle, { borderColor: theme.primary }]} />
          <View style={[styles.loaderDot, { backgroundColor: theme.primary }]} />
        </Animated.View>

        {/* 加载文字 */}
        <ThemedText
          variant="body"
          color={theme.textSecondary}
          style={styles.loadingText}
        >
          {progressText}
        </ThemedText>

        {/* 提示文字 */}
        <ThemedText
          variant="caption"
          color={theme.textMuted}
          style={styles.hintText}
        >
          请稍候，正在为您准备...
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    opacity: 0.3,
  },
  loaderContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  loaderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 0,
  },
  loadingText: {
    marginTop: 32,
    fontSize: 16,
    fontWeight: '500',
  },
  hintText: {
    marginTop: 8,
    fontSize: 13,
  },
});
