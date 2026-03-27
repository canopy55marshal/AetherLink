import { useEffect, useState } from 'react';
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
import LoadingScreen from '@/components/LoadingScreen';

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
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [splashHidden, setSplashHidden] = useState(false);

  // 当应用准备好后，隐藏启动画面和加载屏幕
  useEffect(() => {
    const hideSplash = async () => {
      try {
        // 检查条件：导航就绪且认证加载完成
        if (rootState?.key && !isLoading) {
          console.log('[AuthGuard] Navigation ready and auth loaded, hiding splash...');

          // 立即隐藏Splash Screen
          await SplashScreen.hideAsync();
          console.log('[AuthGuard] Splash screen hidden');
          setSplashHidden(true);

          // 100ms后隐藏加载屏幕（立即进入主界面）
          setTimeout(() => {
            setShowLoadingScreen(false);
            console.log('[AuthGuard] Loading screen hidden');
          }, 100);

          return;
        }
      } catch (error) {
        console.error('Error in splash logic:', error);
        // 出错时强制隐藏
        try {
          await SplashScreen.hideAsync();
        } catch (err) {
          console.warn('Failed to hide splash on error:', err);
        }
        setSplashHidden(true);
        setShowLoadingScreen(false);
      }
    };

    hideSplash();

    // 超时保护：3秒后强制隐藏（更激进）
    const forceHideTimer = setTimeout(async () => {
      console.warn('[AuthGuard] Timeout (3s), force hiding everything...');
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Failed to force hide splash:', error);
      }
      setSplashHidden(true);
      setShowLoadingScreen(false);
      console.log('[AuthGuard] Force hide completed');
    }, 3000);

    return () => {
      clearTimeout(forceHideTimer);
    };
  }, [rootState?.key, isLoading]);

  useEffect(() => {
    console.log('[AuthGuard] Navigation effect - rootState:', !!rootState?.key, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'segments:', segments);

    if (!rootState?.key || isLoading) return;

    const inAuthRoute = segments[0] === 'login' || segments[0] === 'register';

    if (!isAuthenticated && !inAuthRoute) {
      console.log('[AuthGuard] Not authenticated, redirecting to login');
      router.replace('/login');
    }

    if (isAuthenticated && inAuthRoute) {
      console.log('[AuthGuard] Already authenticated, redirecting to home');
      router.replace('/');
    }
  }, [rootState?.key, isAuthenticated, isLoading, segments, router]);

  return (
    <>
      {showLoadingScreen && <LoadingScreen />}
      {children}
    </>
  );
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
