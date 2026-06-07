import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { usePhotographerSpots } from '@features/photographer';
import { EmptyState, PinIcon, Skeleton } from '@shared/ui';

interface SpotsTabProps {
  photographerId: string;
}

export function SpotsTab({ photographerId }: SpotsTabProps) {
  const { data: spots = [], isLoading } = usePhotographerSpots(photographerId);

  if (isLoading) {
    return (
      <View className="gap-4 px-5 pt-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </View>
    );
  }

  if (spots.length === 0) {
    return <EmptyState message="등록된 명소가 없어요" />;
  }

  return (
    <View className="px-5 pb-4 pt-3.5">
      {spots.map((spot) => (
        <View key={spot.spotId} className="mb-[18px]">
          <View className="mb-2.5 flex-row items-center gap-1.5">
            <PinIcon size={13} color="#005049" />
            <Text className="text-[14px] font-bold text-on-surface">{spot.spotNameKo}</Text>
            <Text className="text-[12px] font-semibold text-on-surface-variant">{spot.photos.length}</Text>
          </View>
          <View className="flex-row gap-1.5">
            {spot.photos.slice(0, 4).map((photo) => (
              <View key={photo.id} className="aspect-square w-1/4 overflow-hidden rounded-[10px]">
                <Image source={{ uri: photo.imageUrl }} contentFit="cover" style={{ height: '100%', width: '100%' }} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
