import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CityDetail, CityItem } from '@entities/photographer';
import { useHomeData } from '@features/home';
import { FilterSheet } from '@features/home/components/filter-sheet';
import { HomeSectionRenderer } from '@features/home/components/home-section-renderer';
import { RegionSheet } from '@features/home/components/region-sheet';
import { StylePills } from '@features/home/components/style-pills';
import { useSaveToggle, useLikeToggle } from '@features/photographer';
import { useLocationStore } from '@shared/lib';
import { BellIcon, BrandLogo, FilterIcon, PinIcon, SearchIcon, Skeleton, TabBar } from '@shared/ui';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { city, setCity, clearCity } = useLocationStore();
  const [regionOpen, setRegionOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  const { data: homeData, isLoading } = useHomeData(city?.id);
  const toggleSave = useSaveToggle();
  const toggleLike = useLikeToggle();

  const handleCitySelect = (selected: CityDetail | CityItem) => {
    if ('isActive' in selected) {
      setCity(selected as CityDetail);
    } else {
      setCity({
        id: selected.id,
        nameKo: selected.nameKo,
        nameEn: '',
        countryId: '',
        thumbnailUrl: selected.thumbnailUrl,
        displayOrder: 0,
        isFeatured: false,
        isActive: true,
      });
    }
    setRegionOpen(false);
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* 헤더 */}
      <View className="flex-row items-center justify-between py-1.5 pl-2 pr-4 pt-4">
        <BrandLogo width={90} />
        <Pressable className="p-1 active:opacity-60">
          <BellIcon color="#005049" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-4">
        {/* 히어로 */}
        <View className="px-5 pb-1.5 pt-3.5">
          <Text className="text-[27px] font-extrabold leading-[35px] tracking-[-1px] text-on-surface">
            {city ? `📍 ${city.nameKo}에서\n인생샷을 남겨요` : '당신의 여행을\n인생샷으로.'}
          </Text>
          <View className="mt-4 flex-row items-center overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm">
            <Pressable
              onPress={() => setRegionOpen(true)}
              className="flex-1 flex-row items-center gap-2.5 px-4 py-[15px] active:opacity-70"
            >
              <SearchIcon size={18} color="#005049" />
              <Text numberOfLines={1} className="flex-1 text-[15px] font-medium text-on-surface-variant">
                {city ? `${city.nameKo} 작가 · 스타일 검색` : '어디서 촬영할까요?'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilterOpen(true)}
              className="self-stretch justify-center border-l border-outline-variant px-[15px] active:opacity-70"
            >
              <FilterIcon size={19} color="#005049" />
            </Pressable>
          </View>
        </View>

        {/* 스타일 칩 */}
        <StylePills activeThemeId={activeThemeId} onSelect={setActiveThemeId} />

        {/* 위치 초기화 */}
        {city ? (
          <View className="flex-row items-center gap-2 px-5 pb-0 pt-2">
            <View className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5">
              <PinIcon size={13} color="#005049" />
              <Text className="text-[13px] font-bold text-primary">{city.nameKo}</Text>
            </View>
            <Pressable onPress={clearCity} hitSlop={6} className="active:opacity-60">
              <Text className="text-[12px] font-semibold text-on-surface-variant underline">초기화</Text>
            </Pressable>
          </View>
        ) : null}

        {isLoading ? (
          <View className="gap-4 px-5 pt-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </View>
        ) : null}

        {homeData?.sections.map((section) => (
          <HomeSectionRenderer
            key={section.key}
            section={section}
            onSave={(id, saved) => toggleSave(id, saved)}
            onLike={(id, liked) => toggleLike(id, liked)}
            onCitySelect={handleCitySelect}
          />
        ))}

        <View className="h-6" />
      </ScrollView>

      <TabBar />

      <RegionSheet open={regionOpen} onClose={() => setRegionOpen(false)} onSelect={handleCitySelect} />
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} cityId={city?.id} />
    </View>
  );
}
