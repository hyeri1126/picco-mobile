import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PhotographersQuery } from '@entities/photographer';
import { usePhotographers } from '@features/photographer';
import { ROUTES, href } from '@shared/config';
import { ArrowLeftIcon, EmptyState, PhotographerCard, SearchIcon, Skeleton, TabBar } from '@shared/ui';

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default function PhotographersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [q, setQ] = useState(first(params.q) ?? '');

  const query: PhotographersQuery = {
    cityId: first(params.cityId),
    q: q || undefined,
    sort: first(params.sort) as PhotographersQuery['sort'],
    priceMax: params.priceMax ? Number(first(params.priceMax)) : undefined,
    availableNow: first(params.availableNow) === 'true' ? true : undefined,
    themeId: first(params.themeId),
  };

  const { data, isLoading, fetchNextPage, isFetchingNextPage } = usePhotographers(query);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* 헤더 */}
      <View className="flex-row items-center gap-3 px-4 pb-2 pt-4">
        <Pressable onPress={() => router.back()} hitSlop={8} className="p-1 active:opacity-60">
          <ArrowLeftIcon size={24} color="#171d1c" />
        </Pressable>
        <View className="flex-1 flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5">
          <SearchIcon size={18} color="#9aa8a2" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="작가 이름 또는 도시 검색"
            placeholderTextColor="rgba(62,73,71,0.5)"
            className="flex-1 text-[15px] text-on-surface"
          />
        </View>
      </View>

      {data ? (
        <Text className="px-[18px] py-2 text-[13px] text-on-surface-variant">
          작가 {data.items.length}명{data.hasMore ? '+' : ''}
        </Text>
      ) : null}

      <FlatList
        className="flex-1"
        data={data?.items ?? []}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (data?.hasMore && !isFetchingNextPage) fetchNextPage();
        }}
        renderItem={({ item }) => (
          <PhotographerCard
            photographer={item}
            variant="ranked"
            onPress={() => router.push(href(`${ROUTES.photographers}/${item.id}`))}
          />
        )}
        ListHeaderComponent={
          isLoading ? (
            <View className="gap-3 px-[18px] pt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[80px] rounded-2xl" />
              ))}
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text className="py-4 text-center text-[13px] text-on-surface-variant">불러오는 중...</Text>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? <EmptyState message="조건에 맞는 작가가 없어요" className="pt-16" /> : null
        }
      />

      <TabBar />
    </View>
  );
}
