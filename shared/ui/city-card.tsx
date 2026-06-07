import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CityItem } from '@entities/photographer';

interface CityCardProps {
  city: CityItem;
  onPress?: () => void;
}

export function CityCard({ city, onPress }: CityCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="relative h-[178px] w-[138px] overflow-hidden rounded-[18px] active:opacity-90"
    >
      {city.thumbnailUrl ? (
        <Image source={{ uri: city.thumbnailUrl }} contentFit="cover" style={StyleSheet.absoluteFill} />
      ) : (
        <View className="h-full w-full bg-surface-container" />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
      />
      <View className="absolute bottom-0 left-0 p-3">
        <Text className="text-[18px] font-extrabold text-white">{city.nameKo}</Text>
        <Text className="mt-0.5 text-[11px] font-semibold text-white/85">
          작가 {city.photographerCount}명
        </Text>
      </View>
    </Pressable>
  );
}
