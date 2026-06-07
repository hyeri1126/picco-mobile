import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { CityDetail } from '@entities/photographer';
import { useCountries, useCitiesByCountry } from '@features/region';
import { BottomSheet, SearchIcon, XIcon } from '@shared/ui';

interface RegionSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (city: CityDetail) => void;
}

export function RegionSheet({ open, onClose, onSelect }: RegionSheetProps) {
  const { data: countries = [] } = useCountries();
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const activeCountryId = selectedCountryId ?? countries[0]?.id ?? null;
  const { data: cities = [] } = useCitiesByCountry(activeCountryId);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View className="flex-row items-center justify-between px-[18px] py-[18px]">
        <Text className="text-[20px] font-extrabold text-on-surface">지역 선택</Text>
        <Pressable onPress={onClose} hitSlop={8} className="p-1 active:opacity-60">
          <XIcon size={22} color="#171d1c" strokeWidth={2} />
        </Pressable>
      </View>

      <View className="mx-4 mb-3 flex-row items-center gap-2 rounded-[14px] border border-outline-variant px-[14px] py-[13px]">
        <SearchIcon size={18} color="#3e4947" />
        <Text className="text-[14px] text-on-surface-variant">도시 또는 국가를 검색하세요</Text>
      </View>

      <View className="h-[480px] flex-row overflow-hidden">
        {/* 국가 레일 */}
        <ScrollView className="w-24 bg-primary/5" showsVerticalScrollIndicator={false}>
          {countries.map((country) => {
            const active = country.id === activeCountryId;
            return (
              <Pressable
                key={country.id}
                onPress={() => setSelectedCountryId(country.id)}
                className={`px-3 py-5 ${active ? 'rounded-r-[14px] bg-primary' : ''}`}
              >
                <Text
                  className={`text-[14px] ${
                    active ? 'font-extrabold text-white' : 'font-semibold text-on-surface-variant'
                  }`}
                >
                  {country.nameKo}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 도시 목록 */}
        <ScrollView className="flex-1 px-4 py-1" showsVerticalScrollIndicator={false}>
          {cities.map((city) => (
            <Pressable
              key={city.id}
              onPress={() => { onSelect(city); onClose(); }}
              className="mb-[14px] overflow-hidden rounded-2xl border border-outline-variant bg-white active:opacity-90"
            >
              <View className="h-[118px] w-full bg-surface-container">
                {city.thumbnailUrl ? (
                  <Image source={{ uri: city.thumbnailUrl }} contentFit="cover" style={{ height: '100%', width: '100%' }} />
                ) : null}
              </View>
              <View className="px-[14px] py-3">
                <Text className="text-[17px] font-extrabold text-on-surface">{city.nameKo}</Text>
                <Text className="mt-0.5 text-[12.5px] text-on-surface-variant">{city.nameEn}</Text>
              </View>
            </Pressable>
          ))}
          <View className="h-6" />
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
