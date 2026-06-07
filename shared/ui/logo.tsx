import { Image } from 'expo-image';
import { Text, View } from 'react-native';

const logoSource = require('../../assets/images/logo.png');

interface LogoProps {
  size?: number;
}

export function Logo({ size = 240 }: LogoProps) {
  return (
    <View className="items-center gap-4">
      <Image source={logoSource} style={{ width: size, height: size }} contentFit="contain" />
      <Text className="typo-body-md text-center text-on-surface-variant">
        특별한 순간, 특별한 사진으로
      </Text>
    </View>
  );
}
