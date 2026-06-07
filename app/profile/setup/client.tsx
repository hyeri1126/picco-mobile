import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useCreateClientProfile } from '@features/profile';
import { useAuthStore } from '@shared/auth';
import { uploadProfileImage, type ImageAsset } from '@shared/lib';
import { AvatarUploader, Button, ChipGroup } from '@shared/ui';
import { Header } from '@widgets/header';

const PLACEHOLDER = '#3e494780';

const STYLE_OPTIONS = [
  '아이폰 감성', '필름 감성', '커플 스냅', '우정 스냅',
  '혼자 여행', '야경 촬영', '인생샷', '자연 풍경',
  '시티 감성', '빈티지', '웨딩 스냅', '한복 촬영',
].map((name) => ({ id: name, label: name }));

export default function ClientProfileSetupScreen() {
  const { mutate: createProfile, isPending, error } = useCreateClientProfile();
  const { user } = useAuthStore();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [asset, setAsset] = useState<ImageAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const toggleInterest = (id: string | number) => {
    const val = id as string;
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };

  const handleAvatar = (a: ImageAsset, p: string) => {
    setAsset(a);
    setPreview(p);
  };

  const submit = async () => {
    if (!nickname.trim() || !user) return;
    setUploading(true);
    try {
      let profileImage: string | undefined;
      if (asset) profileImage = await uploadProfileImage(asset, user.id);
      createProfile({ nickname: nickname.trim(), bio: bio.trim() || undefined, interests, profileImage });
    } finally {
      setUploading(false);
    }
  };

  const ready = nickname.trim().length > 0;

  return (
    <View className="flex-1 bg-surface-container-lowest">
      <Header title="여행객 프로필 설정" />

      {/* 진행바 (여행객은 단일 단계) */}
      <View className="mx-6 h-[3px] overflow-hidden rounded-full bg-outline-variant/30">
        <View className="h-full w-full rounded-full bg-primary" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-5 mt-5 typo-body-md text-on-surface-variant">
            여행지에서 어떤 순간을 담고 싶으세요?
          </Text>

          <View className="mb-6 items-center">
            <AvatarUploader preview={preview} onChange={handleAvatar} />
          </View>

          {/* 닉네임 */}
          <View className="mb-4 gap-2">
            <View className="flex-row items-center gap-1.5">
              <Text className="typo-label-md text-on-surface">닉네임</Text>
              <RequiredBadge />
            </View>
            <TextInput
              placeholder="닉네임을 입력하세요"
              placeholderTextColor={PLACEHOLDER}
              value={nickname}
              onChangeText={setNickname}
              className="h-14 rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4 typo-body-md text-on-surface"
            />
          </View>

          {/* 자기소개 */}
          <View className="mb-5 gap-2">
            <View className="flex-row items-center gap-1.5">
              <Text className="typo-label-md text-on-surface">자기소개</Text>
              <Text className="typo-label-sm text-on-surface-variant/60">선택</Text>
            </View>
            <TextInput
              placeholder="어떤 여행을 좋아하는지 간단히 적어주세요"
              placeholderTextColor={PLACEHOLDER}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="min-h-[88px] rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4 py-3.5 typo-body-md text-on-surface"
            />
          </View>

          {/* 관심 스타일 */}
          <View className="mb-8 gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Text className="typo-label-md text-on-surface">관심 스타일</Text>
                <Text className="typo-label-sm text-on-surface-variant/60">선택</Text>
              </View>
              {interests.length > 0 && (
                <Text className="typo-label-sm text-primary">{interests.length}개</Text>
              )}
            </View>
            <Text className="typo-label-sm text-on-surface-variant/70">
              고른 스타일로 홈에서 작가를 추천해드려요
            </Text>
            <ChipGroup items={STYLE_OPTIONS} selected={interests} onToggle={toggleInterest} prefix="#" />
          </View>

          {error && (
            <Text className="mb-4 typo-label-sm text-error">프로필 생성에 실패했습니다.</Text>
          )}

          <Button onPress={submit} disabled={isPending || uploading || !ready}>
            {uploading ? '업로드 중...' : isPending ? '처리 중...' : '시작하기'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function RequiredBadge() {
  return (
    <View className="rounded-full bg-surface-container-low px-2 py-0.5">
      <Text className="text-[11px] font-bold text-primary">필수</Text>
    </View>
  );
}
