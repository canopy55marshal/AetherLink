import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';
import { AuthProvider } from "@/contexts/AuthContext";
import { ColorSchemeProvider } from '@/hooks/useColorScheme';
import FloatingMessageIcon from '@/components/FloatingMessageIcon';
import { useSafeRouter, useSafeSegments } from '@/hooks/useSafeRouter';
import { useRootNavigationState } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

// 防止启动画面自动隐藏
SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const rootState = useRootNavigationState();
  const router = useSafeRouter();
  const segments = useSafeSegments();

  // 当应用准备好后，隐藏启动画面
  useEffect(() => {
    const hideSplash = async () => {
      try {
        // 等待认证加载完成
        if (!isLoading) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error hiding splash screen:', error);
        // 即使出错也尝试隐藏
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [isLoading]);

  useEffect(() => {
    if (!rootState?.key || isLoading) return;

    const inAuthRoute = segments[0] === 'login' || segments[0] === 'register';

    if (!isAuthenticated && !inAuthRoute) {
      router.replace('/login');
    }

    if (isAuthenticated && inAuthRoute) {
      router.replace('/');
    }
  }, [rootState?.key, isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ColorSchemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark"></StatusBar>
          <Stack screenOptions={{
            // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            // 隐藏自带的头部
            headerShown: false
          }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="task-analyze" options={{ headerShown: false }} />
            <Stack.Screen name="task-detail" options={{ headerShown: false }} />
            <Stack.Screen name="knowledge-detail" options={{ headerShown: false }} />
            <Stack.Screen name="knowledge-chain-detail" options={{ headerShown: false }} />
            <Stack.Screen name="model-detail" options={{ headerShown: false }} />
            <Stack.Screen name="pet-service" options={{ headerShown: false }} />
            <Stack.Screen name="pet-care" options={{ headerShown: false }} />
            <Stack.Screen name="community-detail" options={{ headerShown: false }} />
            <Stack.Screen name="contacts" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            <Stack.Screen name="profile-edit" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
          </Stack>
          <AuthGuard>
            <FloatingMessageIconWrapper />
          </AuthGuard>
          <Toast />
        </GestureHandlerRootView>
      </ColorSchemeProvider>
    </AuthProvider>
  );
}

function FloatingMessageIconWrapper() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <FloatingMessageIcon unreadCount={5} />;
}
