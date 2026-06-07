import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { href } from '@shared/config';
import { GoogleIcon, KakaoIcon } from '@shared/ui';

const bg = require('../../assets/images/auth-bg.jpg');

export default function AuthLandingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <Image source={bg} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
      />

      <View
        className="mt-auto gap-4 px-4 pt-8"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="mb-2 items-center">
          <Text className="typo-headline-lg-mobile text-white">시작하기</Text>
          <Text className="typo-body-md mt-2 text-white/80">
            당신의 여행을 더 아름답게 기록해보세요
          </Text>
        </View>

        {/* 카카오 (SDK 연동 미구현) */}
        <Pressable className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-[#FEE500] active:opacity-90">
          <KakaoIcon />
          <Text className="typo-label-md text-[#191919]">카카오로 시작하기</Text>
        </Pressable>

        {/* 구글 (SDK 연동 미구현) */}
        <Pressable className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-white active:opacity-90">
          <GoogleIcon />
          <Text className="typo-label-md text-on-surface">구글로 시작하기</Text>
        </Pressable>

        {/* 이메일 */}
        <Link href={href('/auth/email-signup')} asChild>
          <Pressable className="py-1">
            <Text className="text-center typo-label-md text-white/80 underline">
              이메일로 계속하기
            </Text>
          </Pressable>
        </Link>

        <View className="mt-4 flex-row justify-center gap-4">
          <Text className="typo-label-sm text-white/50">Terms of Service</Text>
          <Text className="typo-label-sm text-white/50">•</Text>
          <Text className="typo-label-sm text-white/50">Privacy Policy</Text>
        </View>
      </View>
    </View>
  );
}
