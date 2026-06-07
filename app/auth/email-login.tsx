import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useEmailLogin } from '@features/auth';
import { href } from '@shared/config';
import { getErrorCode } from '@shared/lib';
import { BrandLogo, Button, EyeIcon, GoogleIcon, KakaoIcon } from '@shared/ui';
import { Header } from '@widgets/header';

const PLACEHOLDER = '#3e494780';

export default function EmailLoginScreen() {
  const { mutate: login, isPending, error } = useEmailLogin();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const submit = () => login({ email: form.email, password: form.password });

  return (
    <View className="flex-1 bg-surface-container-lowest">
      <Header />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-4 pt-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center">
            <BrandLogo width={180} />
          </View>

          <View className="gap-4">
            <View className="overflow-hidden rounded-xl border border-outline-variant">
              <TextInput
                placeholder="이메일"
                placeholderTextColor={PLACEHOLDER}
                value={form.email}
                onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                className="h-14 border-b border-outline-variant px-4 typo-body-md text-on-surface"
              />
              <View className="flex-row items-center">
                <TextInput
                  placeholder="비밀번호"
                  placeholderTextColor={PLACEHOLDER}
                  value={form.password}
                  onChangeText={(t) => setForm((f) => ({ ...f, password: t }))}
                  secureTextEntry={!showPw}
                  className="h-14 flex-1 px-4 typo-body-md text-on-surface"
                />
                <Pressable onPress={() => setShowPw((v) => !v)} className="px-4 py-3">
                  <EyeIcon open={showPw} />
                </Pressable>
              </View>
            </View>

            {error && (
              <Text className="typo-label-sm text-error">
                {getErrorCode(error) === 'USER_NOT_FOUND'
                  ? '가입되지 않은 이메일입니다.'
                  : '이메일 또는 비밀번호가 올바르지 않습니다.'}
              </Text>
            )}

            <Button onPress={submit} disabled={isPending}>
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
          </View>

          {/* 하단 링크 */}
          <View className="mt-6 flex-row items-center justify-center gap-4">
            <Text className="typo-label-sm text-on-surface-variant">비밀번호 찾기</Text>
            <Text className="typo-label-sm text-on-surface-variant">|</Text>
            <Link href={href('/auth/email-signup')}>
              <Text className="typo-label-sm font-semibold text-primary">회원가입</Text>
            </Link>
          </View>

          {/* 간편 로그인 */}
          <View className="mt-10">
            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-outline-variant" />
              <Text className="typo-label-sm text-on-surface-variant">간편 로그인</Text>
              <View className="h-px flex-1 bg-outline-variant" />
            </View>
            <View className="mt-4 flex-row justify-center gap-4">
              <Pressable className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest active:opacity-80">
                <GoogleIcon size={18} />
                <Text className="typo-label-md text-on-surface">Google</Text>
              </Pressable>
              <Pressable className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#FEE500] active:opacity-80">
                <KakaoIcon size={18} />
                <Text className="typo-label-md text-[#191919]">Kakao</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
