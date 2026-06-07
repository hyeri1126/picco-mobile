import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { usePhotographerPhotos } from '@features/photographer';
import { EmptyState, HeartIcon, Skeleton } from '@shared/ui';

interface PhotosTabProps {
  photographerId: string;
}

export function PhotosTab({ photographerId }: PhotosTabProps) {
  const { data: photos = [], isLoading, fetchNextPage, hasNextPage } =
    usePhotographerPhotos(photographerId);

  if (isLoading) {
    return (
      <View className="flex-row flex-wrap px-[1.5px] pt-[1.5px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} className="w-1/3 p-[1.5px]">
            <Skeleton className="aspect-square" />
          </View>
        ))}
      </View>
    );
  }

  if (photos.length === 0) {
    return <EmptyState message="게시물이 없어요" />;
  }

  return (
    <View>
      <View className="flex-row flex-wrap px-[1.5px] pt-[1.5px]">
        {photos.map((photo) => (
          <View key={photo.id} className="w-1/3 p-[1.5px]">
            <View className="relative aspect-square">
              <Image source={{ uri: photo.imageUrl }} contentFit="cover" style={{ height: '100%', width: '100%' }} />
              <View className="absolute bottom-1.5 left-1.5 flex-row items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5">
                <HeartIcon size={11} fill="rgba(255,255,255,0.7)" />
                <Text className="text-[11px] font-bold text-white">{photo.likeCount}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          className="mx-auto mt-3 rounded-xl border border-outline-variant px-6 py-3 active:opacity-80"
        >
          <Text className="text-[14px] font-semibold text-on-surface-variant">더 보기</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
