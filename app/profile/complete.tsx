import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES, href } from '@shared/config';
import { ArrowRightIcon, Logo } from '@shared/ui';

export default function ProfileCompleteScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-between bg-surface px-4"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <View className="flex-1 items-center justify-center gap-6">
        <Logo size={200} />

        {/* 말풍선 */}
        <View className="relative rounded-2xl bg-surface-container px-5 py-3">
          <Text className="typo-body-md text-on-surface">
            준비 끝! 이제 함께 기록을 시작해볼까요? 🌟
          </Text>
        </View>

        <View className="mt-4 items-center">
          <Text className="typo-headline-lg-mobile text-center text-on-surface">
            프로필 생성이 완료되었습니다!
          </Text>
          <Text className="typo-body-md mt-3 text-center text-on-surface-variant">
            이제 Picco와 함께 멋진 순간들을{'\n'}기록할 준비가 되었습니다.
          </Text>
        </View>
      </View>

      <View className="w-full">
        <Link href={href(ROUTES.home)} asChild>
          <Pressable className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary-container active:opacity-90">
            <Text className="typo-label-md text-on-primary">홈으로 이동하기</Text>
            <ArrowRightIcon />
          </Pressable>
        </Link>
        <Text className="mt-6 text-center typo-label-sm tracking-widest text-on-surface-variant">
          PICCO
        </Text>
      </View>
    </View>
  );
}
