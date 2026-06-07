import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PhotographerItem } from '@entities/photographer';

import { BookmarkIcon, CrownIcon, StarIcon, TrendingIcon } from './icons';

interface PhotographerCardProps {
  photographer: PhotographerItem;
  variant: 'ranked' | 'mini';
  onPress?: () => void;
  onSave?: () => void;
}

const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const RANK_COLORS: Record<number, [string, string]> = {
  1: ['#c79a3a', '#b07f24'],
  2: ['#7d8a83', '#7d8a83'],
  3: ['#a39a82', '#a39a82'],
};

export function PhotographerCard({ photographer, variant, onPress, onSave }: PhotographerCardProps) {
  if (variant === 'mini') return <MiniCard p={photographer} onPress={onPress} />;
  return <RankedCard p={photographer} onPress={onPress} onSave={onSave} />;
}

function RankedCard({ p, onPress, onSave }: { p: PhotographerItem; onPress?: () => void; onSave?: () => void }) {
  const showBadge = p.rank != null && p.rank <= 3;

  return (
    <Pressable
      onPress={onPress}
      className="relative mx-[18px] mb-[10px] flex-row items-center gap-3 rounded-2xl border border-outline-variant bg-white p-3 active:opacity-90"
    >
      {showBadge ? (
        <LinearGradient
          colors={RANK_COLORS[p.rank as number]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: -7,
            left: 12,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderRadius: 999,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          {p.rank === 1 ? <CrownIcon /> : null}
          <Text className="text-[10px] font-extrabold text-white">BEST {p.rank}</Text>
        </LinearGradient>
      ) : null}

      <View className="h-[58px] w-[58px] overflow-hidden rounded-xl bg-surface-container">
        {p.thumbnails[0] ? (
          <Image source={{ uri: p.thumbnails[0] }} contentFit="cover" style={StyleSheet.absoluteFill} />
        ) : null}
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-bold text-on-surface">{p.nickname} 작가</Text>
        <View className="mt-0.5 flex-row items-center gap-1">
          <StarIcon />
          <Text className="text-[12px] font-semibold text-on-surface">{p.ratingAvg.toFixed(1)}</Text>
          <Text className="text-[12px] text-on-surface-variant">
            · 저장 {formatCount(p.saveCount)} · 리뷰 {p.reviewCount}
          </Text>
        </View>
        {p.weeklyBookingCount != null ? (
          <View className="mt-1 flex-row items-center gap-1">
            <TrendingIcon />
            <Text className="text-[11.5px] font-semibold text-orange-600">
              이번 주 {p.weeklyBookingCount}명 예약
            </Text>
          </View>
        ) : null}
      </View>

      <View className="items-end gap-2">
        <Pressable hitSlop={8} onPress={onSave} className="p-0.5 active:opacity-60">
          <BookmarkIcon fill={p.saved ? '#005049' : 'none'} stroke={p.saved ? '#005049' : '#9aa8a2'} />
        </Pressable>
        {p.startingPrice != null ? (
          <Text className="text-[14px] font-extrabold text-primary">
            ₩{p.startingPrice.toLocaleString()}~
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function MiniCard({ p, onPress }: { p: PhotographerItem; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[150px] overflow-hidden rounded-2xl border border-outline-variant bg-white active:opacity-90"
    >
      <View className="relative h-[118px] bg-surface-container">
        {p.thumbnails[0] ? (
          <Image source={{ uri: p.thumbnails[0] }} contentFit="cover" style={StyleSheet.absoluteFill} />
        ) : null}
        {p.isLiveAvailable ? (
          <View className="absolute left-2 top-2 flex-row items-center gap-1 rounded-full bg-primary px-2 py-0.5">
            <View className="h-1.5 w-1.5 rounded-full bg-[#7ef0c0]" />
            <Text className="text-[10px] font-bold text-white">지금 가능</Text>
          </View>
        ) : null}
      </View>
      <View className="px-3 pb-3 pt-2">
        <View className="flex-row items-center gap-1">
          {p.profileImage ? (
            <Image source={{ uri: p.profileImage }} contentFit="cover" style={{ width: 20, height: 20, borderRadius: 10 }} />
          ) : null}
          <Text className="text-[14px] font-bold text-on-surface">{p.nickname}</Text>
        </View>
        <View className="mt-1 flex-row items-center gap-1">
          <StarIcon />
          <Text className="text-[12px] text-on-surface-variant">
            {p.ratingAvg.toFixed(1)}
            {p.startingPrice != null ? ` · ₩${p.startingPrice.toLocaleString()}~` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
