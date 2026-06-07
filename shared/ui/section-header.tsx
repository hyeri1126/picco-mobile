import { Pressable, Text, View } from 'react-native';

import { ChevronRightIcon } from './icons';

interface SectionHeaderProps {
  title: string;
  subtitle?: string | null;
  onSeeMore?: () => void;
}

export function SectionHeader({ title, subtitle, onSeeMore }: SectionHeaderProps) {
  return (
    <View className="flex-row items-end justify-between px-[18px] pb-3 pt-[22px]">
      <View className="flex-1">
        <Text className="text-[19px] font-extrabold leading-tight tracking-[-0.5px] text-on-surface">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-[3px] text-[12px] text-on-surface-variant">{subtitle}</Text>
        ) : null}
      </View>
      {onSeeMore ? (
        <Pressable onPress={onSeeMore} className="flex-row items-center gap-0.5 active:opacity-60">
          <Text className="typo-label-sm font-semibold text-primary">전체보기</Text>
          <ChevronRightIcon />
        </Pressable>
      ) : null}
    </View>
  );
}
