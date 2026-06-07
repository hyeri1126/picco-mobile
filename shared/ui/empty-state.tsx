import { Text, View } from 'react-native';

interface EmptyStateProps {
  message: string;
  className?: string;
}

// 빈 결과 안내. 전 목록 화면에서 동일 톤으로 재사용.
export function EmptyState({ message, className = 'pt-10' }: EmptyStateProps) {
  return (
    <View className={className}>
      <Text className="text-center text-[14px] text-on-surface-variant">{message}</Text>
    </View>
  );
}
