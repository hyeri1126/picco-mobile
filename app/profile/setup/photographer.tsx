import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
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

import { useCities, useThemes, useCreatePhotographerProfile } from '@features/profile';
import type { PortfolioPhotoInput } from '@features/profile';
import { useAuthStore } from '@shared/auth';
import { uploadProfileImage, uploadPortfolioImage, type ImageAsset } from '@shared/lib';
import {
  ArrowRightIcon,
  AvatarUploader,
  CheckIcon,
  ChipGroup,
  InstagramIcon,
  LinkIcon,
  PinIcon,
  PlusIcon,
  StepProgressBar,
  XIcon,
} from '@shared/ui';
import { Header } from '@widgets/header';

const PLACEHOLDER = '#3e494780';

interface Step1State {
  nickname: string;
  bio: string;
  profilePreview: string | null;
  profileAsset: ImageAsset | null;
  startingPrice: string;
  instagram: string;
  cityIds: string[];
  themeIds: string[];
}

interface UploadPhoto {
  asset: ImageAsset;
  preview: string;
  cityId: string | null;
}

export default function PhotographerProfileSetupScreen() {
  const { user } = useAuthStore();
  const { mutate: createProfile, isPending } = useCreatePhotographerProfile();
  const { data: cities = [], isLoading: citiesLoading } = useCities();
  const { data: themes = [], isLoading: themesLoading } = useThemes();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  const [s1, setS1] = useState<Step1State>({
    nickname: '',
    bio: '',
    profilePreview: null,
    profileAsset: null,
    startingPrice: '',
    instagram: '',
    cityIds: [],
    themeIds: [],
  });

  const [photos, setPhotos] = useState<UploadPhoto[]>([]);

  const updateS1 = <K extends keyof Step1State>(key: K, val: Step1State[K]) =>
    setS1((prev) => ({ ...prev, [key]: val }));

  const toggleId = (key: 'cityIds' | 'themeIds', id: string) => {
    setS1((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
      };
    });
  };

  const handleAddPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (result.canceled) return;
    const defaultCityId = s1.cityIds[0] ?? null;
    const added: UploadPhoto[] = result.assets.map((a) => ({
      asset: { uri: a.uri, name: a.fileName ?? undefined, type: a.mimeType ?? undefined },
      preview: a.uri,
      cityId: defaultCityId,
    }));
    setPhotos((prev) => [...prev, ...added]);
  };

  const removePhoto = (idx: number) =>
    setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const cycleCity = (idx: number) => {
    if (s1.cityIds.length <= 1) return;
    setPhotos((prev) => {
      const next = [...prev];
      const cur = next[idx].cityId;
      const pos = s1.cityIds.indexOf(cur ?? s1.cityIds[0]);
      next[idx] = { ...next[idx], cityId: s1.cityIds[(pos + 1) % s1.cityIds.length] };
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      let profileImage: string | undefined;
      if (s1.profileAsset) profileImage = await uploadProfileImage(s1.profileAsset, user.id);

      const uploadedPhotos: PortfolioPhotoInput[] = [];
      for (const p of photos) {
        const imageUrl = await uploadPortfolioImage(p.asset, user.id);
        uploadedPhotos.push({ imageUrl, cityId: p.cityId ?? s1.cityIds[0] });
      }

      createProfile({
        nickname: s1.nickname.trim(),
        bio: s1.bio.trim() || undefined,
        profileImage,
        startingPrice: s1.startingPrice ? Number(s1.startingPrice) : undefined,
        instagram: s1.instagram.trim() || undefined,
        cityIds: s1.cityIds,
        themeIds: s1.themeIds,
        photos: uploadedPhotos,
      });
    } catch {
      setSubmitting(false);
    }
  };

  const step1Ready =
    s1.nickname.trim().length > 0 && s1.cityIds.length > 0 && s1.themeIds.length > 0;
  const step2Ready = photos.length >= 3;
  const isLoading = citiesLoading || themesLoading;

  return (
    <View className="flex-1 bg-surface-container-lowest">
      <Header
        title={step === 1 ? '촬영자 프로필' : '포트폴리오'}
        onBack={step === 2 ? () => setStep(1) : undefined}
      />
      <StepProgressBar current={step} total={2} />

      {step === 1 ? (
        <Step1
          s1={s1}
          cities={cities}
          themes={themes}
          isLoading={isLoading}
          onAvatarChange={(asset, url) => {
            updateS1('profileAsset', asset);
            updateS1('profilePreview', url);
          }}
          onNickname={(v) => updateS1('nickname', v)}
          onBio={(v) => updateS1('bio', v)}
          onToggleCity={(id) => toggleId('cityIds', id)}
          onToggleTheme={(id) => toggleId('themeIds', id)}
          onPrice={(v) => updateS1('startingPrice', v)}
          onInstagram={(v) => updateS1('instagram', v)}
          onNext={() => setStep(2)}
          ready={step1Ready}
        />
      ) : (
        <Step2
          photos={photos}
          cityIds={s1.cityIds}
          cities={cities}
          instagram={s1.instagram}
          onAddPhotos={handleAddPhotos}
          onRemovePhoto={removePhoto}
          onCycleCity={cycleCity}
          onSubmit={handleSubmit}
          ready={step2Ready}
          submitting={submitting || isPending}
        />
      )}
    </View>
  );
}

/* ────────────────── Step 1 ────────────────── */

interface Step1Props {
  s1: Step1State;
  cities: { id: string; nameKo: string }[];
  themes: { id: string; name: string }[];
  isLoading: boolean;
  onAvatarChange: (asset: ImageAsset, url: string) => void;
  onNickname: (v: string) => void;
  onBio: (v: string) => void;
  onToggleCity: (id: string) => void;
  onToggleTheme: (id: string) => void;
  onPrice: (v: string) => void;
  onInstagram: (v: string) => void;
  onNext: () => void;
  ready: boolean;
}

function Step1({
  s1, cities, themes, isLoading,
  onAvatarChange, onNickname, onBio,
  onToggleCity, onToggleTheme, onPrice, onInstagram,
  onNext, ready,
}: Step1Props) {
  const cityItems = cities.map((c) => ({ id: c.id, label: c.nameKo }));
  const themeItems = themes.map((t) => ({ id: t.id, label: t.name }));

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerClassName="flex-grow px-6 pb-8" keyboardShouldPersistTaps="handled">
        <View className="my-5 items-center">
          <AvatarUploader preview={s1.profilePreview} onChange={onAvatarChange} />
        </View>

        <FormField label="닉네임" required>
          <TextInput
            placeholder="작가 닉네임"
            placeholderTextColor={PLACEHOLDER}
            value={s1.nickname}
            onChangeText={onNickname}
            className="h-14 rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4 typo-body-md text-on-surface"
          />
        </FormField>

        <FormField label="활동 도시" required count={s1.cityIds.length}>
          {isLoading ? (
            <Text className="typo-label-sm text-on-surface-variant">불러오는 중...</Text>
          ) : (
            <ChipGroup items={cityItems} selected={s1.cityIds} onToggle={(id) => onToggleCity(id as string)} />
          )}
        </FormField>

        <FormField label="촬영 스타일" required count={s1.themeIds.length}>
          {isLoading ? (
            <Text className="typo-label-sm text-on-surface-variant">불러오는 중...</Text>
          ) : (
            <ChipGroup items={themeItems} selected={s1.themeIds} onToggle={(id) => onToggleTheme(id as string)} prefix="#" />
          )}
        </FormField>

        <FormField label="자기소개" note="나중에 가능">
          <TextInput
            placeholder="비워두고 나중에 채워도 돼요"
            placeholderTextColor={PLACEHOLDER}
            value={s1.bio}
            onChangeText={onBio}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="min-h-[88px] rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4 py-3.5 typo-body-md text-on-surface"
          />
        </FormField>

        <FormField label="희망 가격" note="나중에 가능">
          <View className="h-14 flex-row overflow-hidden rounded-[14px] border border-outline-variant">
            <View className="items-center justify-center border-r border-outline-variant bg-surface-container px-4">
              <Text className="typo-label-md text-on-surface-variant">시간당</Text>
            </View>
            <TextInput
              placeholder="50000"
              placeholderTextColor={PLACEHOLDER}
              value={s1.startingPrice}
              onChangeText={onPrice}
              keyboardType="number-pad"
              className="flex-1 bg-surface-container-lowest px-4 typo-body-md text-on-surface"
            />
            <View className="items-center justify-center bg-surface-container-lowest pr-4">
              <Text className="typo-label-md text-on-surface-variant">원</Text>
            </View>
          </View>
        </FormField>

        <FormField label="SNS" note="나중에 가능">
          <View className="h-14 flex-row items-center gap-2.5 rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4">
            <LinkIcon />
            <TextInput
              placeholder="@인스타그램 또는 링크"
              placeholderTextColor={PLACEHOLDER}
              value={s1.instagram}
              onChangeText={onInstagram}
              autoCapitalize="none"
              className="h-14 flex-1 typo-body-md text-on-surface"
            />
          </View>
        </FormField>
      </ScrollView>

      <View className="px-6 pb-8">
        <NextButton onPress={onNext} disabled={!ready}>
          <Text className="typo-label-md text-on-primary">다음으로</Text>
          <ArrowRightIcon />
        </NextButton>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ────────────────── Step 2 ────────────────── */

interface Step2Props {
  photos: UploadPhoto[];
  cityIds: string[];
  cities: { id: string; nameKo: string }[];
  instagram: string;
  onAddPhotos: () => void;
  onRemovePhoto: (idx: number) => void;
  onCycleCity: (idx: number) => void;
  onSubmit: () => void;
  ready: boolean;
  submitting: boolean;
}

function Step2({
  photos, cityIds, cities, instagram,
  onAddPhotos, onRemovePhoto, onCycleCity,
  onSubmit, ready, submitting,
}: Step2Props) {
  const cityMap = Object.fromEntries(cities.map((c) => [c.id, c.nameKo]));

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="flex-grow px-6 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="mt-5 text-[28px] font-extrabold leading-[36px] text-on-surface">
          {'베스트 컷을\n보여주세요'}
        </Text>

        {!!instagram && (
          <LinearGradient
            colors={['#f58529', '#dd2a7b', '#8134af']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 14, marginTop: 16 }}
          >
            <Pressable className="w-full flex-row items-center gap-2.5 px-4 py-3.5 active:opacity-90">
              <InstagramIcon />
              <Text className="typo-label-md text-white">인스타에서 불러오기</Text>
              <Text className="ml-auto text-[12px] font-semibold text-white opacity-85">
                {instagram}의 최근 게시물
              </Text>
            </Pressable>
          </LinearGradient>
        )}

        <View className="mt-4 flex-row flex-wrap">
          {photos.map((p, i) => (
            <View key={p.preview} className="w-1/3 p-1">
              <View className="relative aspect-square">
                <Image
                  source={{ uri: p.preview }}
                  style={{ width: '100%', height: '100%', borderRadius: 12 }}
                  contentFit="cover"
                />
                <Pressable
                  onPress={() => onRemovePhoto(i)}
                  className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/55"
                >
                  <XIcon />
                </Pressable>
                {p.cityId !== null && cityIds.length > 0 && (
                  <Pressable
                    onPress={() => onCycleCity(i)}
                    className="absolute bottom-1 left-1 flex-row items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5"
                  >
                    <PinIcon />
                    <Text className="text-[10.5px] font-bold text-white">{cityMap[p.cityId] ?? ''}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
          <View className="w-1/3 p-1">
            <Pressable
              onPress={onAddPhotos}
              className="aspect-square items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-outline-variant bg-surface-container active:opacity-80"
            >
              <PlusIcon />
              <Text className="text-[11px] font-semibold text-on-surface-variant">사진 추가</Text>
            </Pressable>
          </View>
        </View>

        <View
          className={`mt-4 flex-row items-center gap-1.5 rounded-xl border px-3.5 py-3 ${
            ready ? 'border-[#cfe3da] bg-surface-container-low' : 'border-[#f6dcd7] bg-[#fff4f2]'
          }`}
        >
          {ready ? (
            <>
              <CheckIcon />
              <Text className="typo-label-sm text-primary">시작 준비 완료! ({photos.length}장)</Text>
            </>
          ) : (
            <Text className="typo-label-sm text-[#c9564d]">
              시작하려면 베스트 컷 3장 이상 · 현재 {photos.length}장
            </Text>
          )}
        </View>

        <Text className="mt-3 typo-label-sm leading-[18px] text-on-surface-variant">
          💡 사진의 도시 태그를 눌러 바꿀 수 있어요 (홈에서 도시별 노출에 쓰여요)
        </Text>
      </ScrollView>

      <View className="px-6 pb-8">
        <NextButton onPress={onSubmit} disabled={!ready || submitting}>
          <Text className="typo-label-md text-on-primary">{submitting ? '업로드 중...' : '시작하기'}</Text>
        </NextButton>
      </View>
    </View>
  );
}

/* ────────────────── Shared sub-components ────────────────── */

interface FormFieldProps {
  label: string;
  required?: boolean;
  note?: string;
  count?: number;
  children: React.ReactNode;
}

function FormField({ label, required, note, count, children }: FormFieldProps) {
  return (
    <View className="mb-5 gap-2.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Text className="typo-label-md text-on-surface">{label}</Text>
          {required && (
            <View className="rounded-full bg-surface-container-low px-2 py-0.5">
              <Text className="text-[11px] font-bold text-primary">필수</Text>
            </View>
          )}
          {note && <Text className="typo-label-sm text-on-surface-variant/60">{note}</Text>}
        </View>
        {count !== undefined && count > 0 && (
          <Text className="typo-label-sm font-bold text-primary">{count}개</Text>
        )}
      </View>
      {children}
    </View>
  );
}

interface NextButtonProps {
  onPress: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

function NextButton({ onPress, disabled, children }: NextButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl ${
        disabled ? 'bg-primary/40' : 'bg-primary'
      }`}
    >
      {children}
    </Pressable>
  );
}
