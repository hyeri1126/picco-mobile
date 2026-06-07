import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PhotoItem } from '@entities/photographer';

import { HeartIcon } from './icons';

interface PhotoMasonryProps {
  photos: PhotoItem[];
  onPhotoPress?: (photographerId: string) => void;
  onLike: (photoId: string, liked: boolean) => void;
}

// 웹은 CSS columns였지만 작품컷이 정사각(400×400)으로 렌더되므로 2열 그리드로 충실 이식.
export function PhotoMasonry({ photos, onPhotoPress, onLike }: PhotoMasonryProps) {
  if (photos.length === 0) return null;

  return (
    <View className="flex-row flex-wrap px-[14px]">
      {photos.map((photo) => (
        <View key={photo.id} className="w-1/2 p-1">
          <PhotoMasonryCard photo={photo} onPhotoPress={onPhotoPress} onLike={onLike} />
        </View>
      ))}
    </View>
  );
}

interface PhotoMasonryCardProps {
  photo: PhotoItem;
  onPhotoPress?: (photographerId: string) => void;
  onLike: (photoId: string, liked: boolean) => void;
}

function PhotoMasonryCard({ photo, onPhotoPress, onLike }: PhotoMasonryCardProps) {
  return (
    <Pressable
      onPress={() => onPhotoPress?.(photo.photographer.id)}
      className="relative aspect-square overflow-hidden rounded-2xl active:opacity-90"
    >
      <Image source={{ uri: photo.imageUrl }} contentFit="cover" style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={StyleSheet.absoluteFill} />
      <Pressable
        hitSlop={6}
        onPress={() => onLike(photo.id, photo.liked)}
        className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-black/30 px-2 py-1 active:opacity-80"
      >
        <HeartIcon size={13} fill={photo.liked ? '#fff' : 'rgba(255,255,255,0.5)'} stroke="#fff" />
        <Text className="text-[11px] font-bold text-white">
          {photo.liked ? photo.likeCount + 1 : photo.likeCount}
        </Text>
      </Pressable>
      <Text className="absolute bottom-2 left-2 text-[12px] font-bold text-white">
        {photo.photographer.nickname}
      </Text>
    </Pressable>
  );
}
