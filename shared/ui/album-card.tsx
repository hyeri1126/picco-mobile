import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AlbumItem } from '@entities/photographer';

import { HeartIcon, PinIcon } from './icons';

interface AlbumCardProps {
  album: AlbumItem;
  onPress?: () => void;
}

export function AlbumCard({ album, onPress }: AlbumCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="relative h-[148px] w-[200px] overflow-hidden rounded-2xl active:opacity-90"
    >
      {album.coverImageUrl ? (
        <Image source={{ uri: album.coverImageUrl }} contentFit="cover" style={StyleSheet.absoluteFill} />
      ) : (
        <View className="h-full w-full bg-surface-container" />
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />
      <View className="absolute inset-0 justify-between p-[11px]">
        {album.spot ? (
          <View className="flex-row items-center gap-1 self-start rounded-full bg-white/90 px-2.5 py-1">
            <PinIcon size={11} color="#005049" />
            <Text className="text-[11px] font-bold text-primary">{album.spot.nameKo}</Text>
          </View>
        ) : (
          <View />
        )}
        <View className="flex-row items-center gap-1">
          <HeartIcon size={12} fill="#fff" />
          <Text className="text-[12px] font-bold text-white">{album.likeCount.toLocaleString()}</Text>
        </View>
      </View>
    </Pressable>
  );
}
