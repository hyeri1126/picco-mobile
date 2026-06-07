import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePhotographerDetail, useSaveToggle } from '@features/photographer';
import { PhotosTab } from '@features/photographer/components/photos-tab';
import { ReviewsTab } from '@features/photographer/components/reviews-tab';
import { SpotsTab } from '@features/photographer/components/spots-tab';
import {
  ArrowLeftIcon, BookmarkIcon, ChatIcon, GridIcon, MapIcon,
  PinIcon, ShareIcon, Skeleton, StarIcon, TabBar,
} from '@shared/ui';

type Tab = 'photos' | 'reviews' | 'spots';

const TABS: { id: Tab; label: string }[] = [
  { id: 'photos', label: 'PHOTOS' },
  { id: 'reviews', label: 'REVIEWS' },
  { id: 'spots', label: 'SPOTS' },
];

function TabIcon({ tab, color }: { tab: Tab; color: string }) {
  if (tab === 'photos') return <GridIcon size={16} color={color} />;
  if (tab === 'reviews') return <StarIcon size={16} color={color} filled={false} />;
  return <MapIcon size={16} color={color} />;
}

const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function PhotographerDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('photos');

  const { data: photographer, isLoading } = usePhotographerDetail(id);
  const toggleSave = useSaveToggle();

  if (isLoading || !photographer) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="px-4 pb-2 pt-4">
          <Pressable onPress={() => router.back()} hitSlop={8} className="p-1 active:opacity-60">
            <ArrowLeftIcon size={24} color="#171d1c" />
          </Pressable>
        </View>
        <View className="gap-4 px-5 pt-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-20 rounded-2xl" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* 상단 바 */}
      <View className="flex-row items-center justify-between px-4 pb-1.5 pt-4">
        <Pressable onPress={() => router.back()} hitSlop={8} className="p-1 active:opacity-60">
          <ArrowLeftIcon size={24} color="#171d1c" />
        </Pressable>
        <Pressable hitSlop={8} className="p-1 active:opacity-60">
          <ShareIcon size={19} color="#171d1c" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 프로필 헤더 */}
        <View className="items-center px-5 pb-0 pt-1.5">
          <View className="mb-2.5 h-[84px] w-[84px] overflow-hidden rounded-full bg-surface-container">
            {photographer.profileImage ? (
              <Image source={{ uri: photographer.profileImage }} contentFit="cover" style={{ height: '100%', width: '100%' }} />
            ) : null}
          </View>

          <Text className="text-[20px] font-extrabold text-on-surface">{photographer.nickname} 작가</Text>

          {photographer.cities.length > 0 ? (
            <View className="mt-1 flex-row items-center gap-1">
              <PinIcon size={13} color="#3e4947" />
              <Text className="text-[13px] text-on-surface-variant">
                {photographer.cities.map((c) => c.nameKo).join(', ')}
              </Text>
            </View>
          ) : null}

          {photographer.bio ? (
            <Text className="mt-2.5 text-center text-[13px] leading-[21px] text-[#46544d]">{photographer.bio}</Text>
          ) : null}

          {/* 통계 */}
          <View className="mt-3.5 flex-row overflow-hidden rounded-[14px] border border-outline-variant bg-white">
            <StatCell value={String(photographer.postCount)} label="게시물" />
            <StatCell value={`★ ${photographer.ratingAvg.toFixed(1)}`} label={`리뷰 ${photographer.reviewCount}`} border />
            <StatCell value={formatCount(photographer.saveCount)} label="저장" border />
          </View>

          {/* 액션 버튼 */}
          <View className="mt-3 flex-row gap-2.5 self-stretch">
            <Pressable
              onPress={() => toggleSave(photographer.id, photographer.saved)}
              className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-3.5 active:opacity-90 ${
                photographer.saved ? 'border-primary bg-primary' : 'border-primary'
              }`}
            >
              <BookmarkIcon
                size={16}
                fill={photographer.saved ? '#fff' : 'none'}
                stroke={photographer.saved ? '#fff' : '#005049'}
              />
              <Text className={`text-[14px] font-bold ${photographer.saved ? 'text-white' : 'text-primary'}`}>
                {photographer.saved ? '저장됨' : '저장'}
              </Text>
            </Pressable>
            <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-outline-variant py-3.5 active:opacity-90">
              <ChatIcon size={16} color="#171d1c" />
              <Text className="text-[14px] font-bold text-on-surface">채팅하기</Text>
            </Pressable>
          </View>
        </View>

        {/* 탭 */}
        <View className="mt-[18px] flex-row border-b border-outline-variant">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const color = active ? '#005049' : 'rgba(62,73,71,0.6)';
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 flex-row items-center justify-center gap-1.5 border-b-2 py-3 ${
                  active ? 'border-primary' : 'border-transparent'
                }`}
              >
                <TabIcon tab={tab.id} color={color} />
                <Text className="text-[12px] font-bold" style={{ color }}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'photos' ? <PhotosTab photographerId={id} /> : null}
        {activeTab === 'reviews' ? <ReviewsTab photographerId={id} /> : null}
        {activeTab === 'spots' ? <SpotsTab photographerId={id} /> : null}

        <View className="h-6" />
      </ScrollView>

      {/* 하단 예약 (스텁) */}
      <View className="flex-row items-center justify-between gap-3 border-t border-outline-variant bg-white px-5 py-3.5">
        <View>
          <Text className="text-[11px] text-on-surface-variant">1인 기준 가격</Text>
          <Text className="text-[19px] font-extrabold text-on-surface">
            {photographer.startingPrice != null
              ? `₩${photographer.startingPrice.toLocaleString()} ~`
              : '가격 문의'}
          </Text>
        </View>
        <Pressable className="max-w-[170px] flex-1 items-center rounded-[14px] bg-primary py-4 active:opacity-90">
          <Text className="text-[15px] font-bold text-white">예약하기</Text>
        </Pressable>
      </View>

      <TabBar />
    </View>
  );
}

function StatCell({ value, label, border }: { value: string; label: string; border?: boolean }) {
  return (
    <View className={`flex-1 items-center py-3 ${border ? 'border-l border-outline-variant' : ''}`}>
      <Text className="text-[16px] font-extrabold text-on-surface">{value}</Text>
      <Text className="text-[11px] text-on-surface-variant">{label}</Text>
    </View>
  );
}
