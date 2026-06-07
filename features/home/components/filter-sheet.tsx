import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { useThemes } from '@features/profile';
import { href } from '@shared/config';
import { BottomSheet, Pill, XIcon } from '@shared/ui';

const SORTS = [
  { value: 'recommended', label: '추천순' },
  { value: 'rating', label: '별점 높은순' },
  { value: 'reviews', label: '후기 많은순' },
  { value: 'priceAsc', label: '가격 낮은순' },
] as const;

type SortValue = (typeof SORTS)[number]['value'];

// 웹은 슬라이더였지만 RN 슬라이더 미설치 → 프리셋 칩으로 적응(추후 슬라이더 교체 가능).
const PRICE_PRESETS: { label: string; value: number | null }[] = [
  { label: '10만 이하', value: 100000 },
  { label: '20만 이하', value: 200000 },
  { label: '30만 이하', value: 300000 },
  { label: '50만 이하', value: 500000 },
  { label: '제한 없음', value: null },
];

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  cityId?: string;
}

export function FilterSheet({ open, onClose, cityId }: FilterSheetProps) {
  const router = useRouter();
  const { data: themes = [] } = useThemes();

  const [sort, setSort] = useState<SortValue>('recommended');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [availableNow, setAvailableNow] = useState(false);
  const [themeIds, setThemeIds] = useState<string[]>([]);

  const toggleTheme = (id: string) =>
    setThemeIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const handleReset = () => {
    setSort('recommended');
    setMaxPrice(null);
    setAvailableNow(false);
    setThemeIds([]);
  };

  const handleApply = () => {
    const parts: string[] = [];
    if (cityId) parts.push(`cityId=${encodeURIComponent(cityId)}`);
    if (sort !== 'recommended') parts.push(`sort=${sort}`);
    if (maxPrice != null) parts.push(`priceMax=${maxPrice}`);
    if (availableNow) parts.push('availableNow=true');
    themeIds.forEach((id) => parts.push(`themeId=${encodeURIComponent(id)}`));
    const qs = parts.join('&');
    router.push(href(qs ? `/photographers?${qs}` : '/photographers'));
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View className="flex-row items-center justify-between px-[18px] pb-3 pt-[18px]">
        <Pressable onPress={onClose} hitSlop={8} className="p-1 active:opacity-60">
          <XIcon size={22} color="#171d1c" strokeWidth={2} />
        </Pressable>
        <Text className="text-[20px] font-extrabold text-primary">필터 설정</Text>
        <View className="w-7" />
      </View>

      <ScrollView className="px-[18px]" showsVerticalScrollIndicator={false}>
        {/* 정렬 */}
        <Text className="mb-[11px] mt-5 text-[15px] font-extrabold text-on-surface">정렬 기준</Text>
        <View className="-mx-[5px] flex-row flex-wrap">
          {SORTS.map((s) => (
            <View key={s.value} className="w-1/2 p-[5px]">
              <Pill
                active={sort === s.value}
                onPress={() => setSort(s.value)}
                label={s.label}
                variant="outline"
                size="md"
                trailingCheck
              />
            </View>
          ))}
        </View>

        {/* 가격대 */}
        <Text className="mb-[11px] mt-[22px] text-[15px] font-extrabold text-on-surface">
          가격대 <Text className="text-[12px] font-normal text-on-surface-variant">1시간당 가격</Text>
        </Text>
        <View className="flex-row flex-wrap gap-[9px]">
          {PRICE_PRESETS.map((p) => (
            <Pill
              key={p.label}
              active={maxPrice === p.value}
              onPress={() => setMaxPrice(p.value)}
              label={p.label}
              variant="outline"
            />
          ))}
        </View>

        {/* 예약 가능 */}
        <View className="mt-[18px] flex-row items-center justify-between rounded-[14px] border border-outline-variant bg-white px-4 py-[15px]">
          <View>
            <Text className="text-[14px] font-bold text-on-surface">예약 가능 여부</Text>
            <Text className="mt-0.5 text-[12px] text-on-surface-variant">지금 예약 가능한 작가만 보기</Text>
          </View>
          <Switch
            value={availableNow}
            onValueChange={setAvailableNow}
            trackColor={{ false: '#bec9c6', true: '#005049' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* 촬영 스타일 */}
        <Text className="mb-[11px] mt-5 text-[15px] font-extrabold text-on-surface">촬영 스타일</Text>
        <View className="flex-row flex-wrap gap-[9px] pb-4">
          {themes.map((t) => (
            <Pill
              key={t.id}
              active={themeIds.includes(t.id as string)}
              onPress={() => toggleTheme(t.id as string)}
              label={t.name}
              variant="outline"
            />
          ))}
        </View>
      </ScrollView>

      <View className="flex-row gap-2.5 border-t border-outline-variant px-[18px] py-3">
        <Pressable
          onPress={handleReset}
          className="w-24 items-center rounded-[14px] border border-outline-variant py-4 active:opacity-80"
        >
          <Text className="text-[15px] font-bold text-on-surface">초기화</Text>
        </Pressable>
        <Pressable
          onPress={handleApply}
          className="flex-1 items-center rounded-[14px] bg-primary py-4 active:opacity-90"
        >
          <Text className="text-[15px] font-bold text-white">적용하기</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
