import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, Text, View } from 'react-native';

import type { ImageAsset } from '@shared/lib';
import { CameraIcon, PencilIcon } from './icons';

interface AvatarUploaderProps {
  preview: string | null;
  caption?: string;
  onChange: (asset: ImageAsset, preview: string) => void;
}

export function AvatarUploader({
  preview,
  caption = '프로필 사진 업로드',
  onChange,
}: AvatarUploaderProps) {
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled) return;
    const a = result.assets[0];
    onChange(
      { uri: a.uri, name: a.fileName ?? undefined, type: a.mimeType ?? undefined },
      a.uri,
    );
  };

  return (
    <View className="items-center gap-2.5">
      <Pressable
        onPress={pick}
        className="relative h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full bg-surface-container active:opacity-80"
      >
        {preview ? (
          <Image source={{ uri: preview }} style={{ width: 92, height: 92 }} contentFit="cover" />
        ) : (
          <CameraIcon />
        )}
        <View className="absolute bottom-[3px] right-[3px] h-[27px] w-[27px] items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary">
          <PencilIcon />
        </View>
      </Pressable>
      <Text className="typo-label-sm text-on-surface-variant">{caption}</Text>
    </View>
  );
}
