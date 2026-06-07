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

import { useEmailSignup } from '@features/auth';
import { href } from '@shared/config';
import { getErrorCode } from '@shared/lib';
import { BrandLogo, Button, CheckIcon, EyeIcon, Logo } from '@shared/ui';
import { Header } from '@widgets/header';

const PLACEHOLDER = '#3e494780';

export default function EmailSignupScreen() {
  const { mutate: signup, isPending, error } = useEmailSignup();

  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const passwordMismatch =
    form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

  const submit = () => {
    if (!agreed || passwordMismatch) return;
    signup({ email: form.email, password: form.password });
  };

  return (
    <View className="flex-1 bg-surface-container-lowest">
      <Header title="회원가입" divider />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-4 pt-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8 items-center">
            <BrandLogo width={180} />
            <Logo size={150} />
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
              <View className="flex-row items-center border-b border-outline-variant">
                <TextInput
                  placeholder="비밀번호(8자 이상 영문, 숫자 포함)"
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
              <View className="flex-row items-center">
                <TextInput
                  placeholder="비밀번호 확인"
                  placeholderTextColor={PLACEHOLDER}
                  value={form.passwordConfirm}
                  onChangeText={(t) => setForm((f) => ({ ...f, passwordConfirm: t }))}
                  secureTextEntry={!showPwConfirm}
                  className="h-14 flex-1 px-4 typo-body-md text-on-surface"
                />
                <Pressable onPress={() => setShowPwConfirm((v) => !v)} className="px-4 py-3">
                  <EyeIcon open={showPwConfirm} />
                </Pressable>
              </View>
            </View>

            {passwordMismatch && (
              <Text className="typo-label-sm text-error">비밀번호가 일치하지 않습니다.</Text>
            )}

            {/* 약관 동의 */}
            <Pressable
              onPress={() => setAgreed((v) => !v)}
              className="mb-4 flex-row items-start gap-3"
            >
              <View
                className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
                  agreed ? 'border-primary bg-primary' : 'border-outline-variant bg-transparent'
                }`}
              >
                {agreed && <CheckIcon size={13} color="#ffffff" />}
              </View>
              <Text className="flex-1 typo-body-md text-on-surface">
                <Text className="font-semibold">(필수)</Text>{' '}
                <Text className="text-primary underline">이용약관</Text> 및{' '}
                <Text className="text-primary underline">개인정보 처리방침</Text>에 동의합니다.
              </Text>
            </Pressable>

            {error && (
              <Text className="typo-label-sm text-error">
                {getErrorCode(error) === 'EMAIL_ALREADY_EXISTS'
                  ? '이미 가입된 이메일입니다.'
                  : getErrorCode(error) === 'INVALID_INPUT'
                    ? '입력 정보를 다시 확인해 주세요.'
                    : '회원가입에 실패했습니다. 다시 시도해 주세요.'}
              </Text>
            )}

            <Button onPress={submit} disabled={isPending || !agreed || passwordMismatch}>
              {isPending ? '처리 중...' : '시작하기'}
            </Button>
          </View>

          <View className="mt-6 flex-row justify-center">
            <Text className="typo-label-md text-on-surface-variant">이미 계정이 있으신가요? </Text>
            <Link href={href('/auth/email-login')}>
              <Text className="typo-label-md font-semibold text-primary">로그인</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
