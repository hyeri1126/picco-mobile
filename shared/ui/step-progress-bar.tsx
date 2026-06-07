import { Text, View } from 'react-native';

interface StepProgressBarProps {
  current: number;
  total: number;
}

export function StepProgressBar({ current, total }: StepProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <>
      <View className="mx-6 h-[3px] overflow-hidden rounded-full bg-outline-variant/30">
        <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </View>
      <Text className="px-6 pt-2.5 typo-label-sm font-bold text-primary">
        {current} / {total}
      </Text>
    </>
  );
}
