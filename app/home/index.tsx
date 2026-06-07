import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLogout } from '@features/auth';
import { useAuthStore } from '@shared/auth';
import { Button } from '@shared/ui';

// Phase 1 placeholder. 실제 홈(섹션/탐색)은 Phase 2에서 구현.
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  return (
    <View
      className="flex-1 items-center justify-center gap-3 bg-background px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text className="typo-headline-lg-mobile text-primary">Picco</Text>
      <Text className="typo-body-md text-on-surface-variant">홈 화면 준비중 (Phase 2)</Text>
      {user?.email ? (
        <Text className="typo-label-sm text-on-surface-variant">{user.email}</Text>
      ) : null}
      <View className="mt-4">
        <Button variant="outline" fullWidth={false} onPress={() => logout()}>
          로그아웃
        </Button>
      </View>
    </View>
  );
}
