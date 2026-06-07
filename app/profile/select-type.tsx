import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES, href } from '@shared/config';
import { ArrowRightIcon, BrandLogo, CameraIcon, PersonIcon } from '@shared/ui';

type ProfileType = 'CLIENT' | 'PHOTOGRAPHER';

export default function SelectTypeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<ProfileType>('CLIENT');

  const next = () =>
    router.push(href(selected === 'CLIENT' ? ROUTES.setupClient : ROUTES.setupPhotographer));

  return (
    <View className="flex-1 bg-surface-container-lowest px-6" style={{ paddingTop: insets.top }}>
      <View className="items-center justify-center py-4">
        <BrandLogo width={120} />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pt-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="typo-headline-lg-mobile text-on-surface">{'어떤 역할을\n맡으시나요?'}</Text>
        <Text className="typo-body-md mb-8 mt-3 text-on-surface-variant">
          당신에게 꼭 맞는 경험을 준비해 드릴게요.
        </Text>

        <View className="gap-4">
          <RoleCard
            active={selected === 'CLIENT'}
            onSelect={() => setSelected('CLIENT')}
            icon={<PersonIcon color={selected === 'CLIENT' ? '#fff' : '#6b7a73'} />}
            title="여행객"
            description="특별한 순간을 기록하고 싶으신가요? 최고의 촬영 작가와 함께 잊지 못할 추억을 만들어보세요."
          />
          <RoleCard
            active={selected === 'PHOTOGRAPHER'}
            onSelect={() => setSelected('PHOTOGRAPHER')}
            icon={<CameraIcon size={24} color={selected === 'PHOTOGRAPHER' ? '#fff' : '#6b7a73'} />}
            title="촬영자"
            description="자신의 시선을 공유하고 싶으신가요? 당신의 렌즈를 통해 여행객들의 소중한 찰나를 포착하세요."
          />
        </View>
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable
          onPress={next}
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-primary active:opacity-90"
        >
          <Text className="typo-label-md text-on-primary">다음 단계로</Text>
          <ArrowRightIcon />
        </Pressable>
      </View>
    </View>
  );
}

interface RoleCardProps {
  active: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RoleCard({ active, onSelect, icon, title, description }: RoleCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      className={`flex-row items-start gap-3.5 rounded-[18px] border-2 p-5 ${
        active
          ? 'border-primary bg-surface-container-low'
          : 'border-outline-variant bg-surface-container-lowest'
      }`}
    >
      <View
        className={`h-[52px] w-[52px] items-center justify-center rounded-full ${
          active ? 'bg-primary' : 'bg-surface-container'
        }`}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[17px] font-extrabold text-on-surface">{title}</Text>
        <Text className="typo-body-md mt-1.5 text-on-surface-variant">{description}</Text>
      </View>
      <View
        className={`mt-1 h-[22px] w-[22px] items-center justify-center rounded-full border-2 ${
          active ? 'border-primary' : 'border-outline-variant'
        }`}
      >
        {active && <View className="h-[11px] w-[11px] rounded-full bg-primary" />}
      </View>
    </Pressable>
  );
}
