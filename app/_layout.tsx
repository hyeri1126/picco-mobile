import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { setUnauthorizedHandler } from '@shared/api';
import { ROUTES, href } from '@shared/config';
import { Providers } from '@shared/lib';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // 401 발생 시 인증 화면으로 (http-client의 콜백에 등록)
  useEffect(() => {
    setUnauthorizedHandler(() => router.replace(href(ROUTES.auth)));
    return () => setUnauthorizedHandler(null);
  }, [router]);

  return (
    <Providers>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </Providers>
  );
}
