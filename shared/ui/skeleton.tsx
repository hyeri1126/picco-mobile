import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SkeletonProps {
  className?: string;
}

// 로딩 플레이스홀더. shape(width/height/rounded)는 className으로 주입.
export function Skeleton({ className = '' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 650, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View className={`overflow-hidden bg-surface-container ${className}`}>
      <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#dfe6e3', opacity }]} />
    </View>
  );
}
