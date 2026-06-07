import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAuthStore } from '@shared/auth';
import { ROUTES, href } from '@shared/config';

export default function SplashScreen() {
  const { initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    initializeAuth().then((destination) => {
      if (cancelled) return;
      if (destination === 'home') router.replace(href(ROUTES.home));
      else if (destination === 'select-type') router.replace(href(ROUTES.selectType));
      else router.replace(href(ROUTES.auth));
    });
    return () => {
      cancelled = true;
    };
    // 마운트 시 1회
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-primary-container px-4">
      <View className="items-center gap-4">
        <ActivityIndicator color="#95e7db" size="large" />
        <Text className="typo-label-md text-on-primary-container">Picco</Text>
      </View>
    </View>
  );
}
