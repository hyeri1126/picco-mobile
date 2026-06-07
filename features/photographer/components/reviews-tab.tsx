import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { usePhotographerReviews } from '@features/photographer';
import { CameraIcon, EmptyState, Pill, Skeleton } from '@shared/ui';

interface ReviewsTabProps {
  photographerId: string;
}

export function ReviewsTab({ photographerId }: ReviewsTabProps) {
  const [photoOnly, setPhotoOnly] = useState(false);
  const { data: reviews = [], isLoading, fetchNextPage, hasNextPage } =
    usePhotographerReviews(photographerId, photoOnly);

  return (
    <View className="px-5 pb-4 pt-3.5">
      <View className="mb-3.5 flex-row gap-2">
        <Pill active={!photoOnly} onPress={() => setPhotoOnly(false)} label="전체" />
        <Pill
          active={photoOnly}
          onPress={() => setPhotoOnly(true)}
          label="포토 리뷰"
          icon={<CameraIcon size={12} color={photoOnly ? '#ffffff' : '#3e4947'} strokeWidth={2} />}
        />
      </View>

      {isLoading ? (
        <View className="gap-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </View>
      ) : null}

      {reviews.map((review) => (
        <View key={review.id} className="mb-2.5 rounded-[14px] border border-outline-variant bg-white p-3.5">
          <View className="flex-row items-center gap-1.5">
            {review.clientProfileImage ? (
              <Image source={{ uri: review.clientProfileImage }} contentFit="cover" style={{ width: 28, height: 28, borderRadius: 14 }} />
            ) : null}
            <Text className="text-[14px] font-bold text-on-surface">{review.clientNickname}</Text>
            <Text className="text-[13px] text-[#f0a500]">{'★'.repeat(review.rating)}</Text>
            {review.images.length > 0 ? (
              <View className="ml-0.5 flex-row items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                <CameraIcon size={12} color="#005049" strokeWidth={2} />
                <Text className="text-[10px] font-bold text-primary">포토</Text>
              </View>
            ) : null}
            <Text className="ml-auto text-[11px] text-on-surface-variant">
              {new Date(review.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          {review.content ? (
            <Text className="mt-2 text-[13px] leading-[1.6] text-[#46544d]">{review.content}</Text>
          ) : null}
          {review.images.length > 0 ? (
            <View className="mt-2.5 flex-row gap-1.5">
              {review.images.map((url, i) => (
                <Image key={i} source={{ uri: url }} contentFit="cover" style={{ width: 64, height: 64, borderRadius: 10 }} />
              ))}
            </View>
          ) : null}
        </View>
      ))}

      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          className="mt-1 items-center rounded-xl border border-outline-variant py-3 active:opacity-80"
        >
          <Text className="text-[14px] font-semibold text-on-surface-variant">더 보기</Text>
        </Pressable>
      ) : null}

      {!isLoading && reviews.length === 0 ? (
        <EmptyState message={photoOnly ? '포토 리뷰가 없어요' : '아직 리뷰가 없어요'} />
      ) : null}
    </View>
  );
}
