import { Pressable, Text } from 'react-native';

import { CheckIcon } from './icons';

interface PillProps {
  active: boolean;
  onPress: () => void;
  label: string;
  emoji?: string;
  icon?: React.ReactNode;
  trailingCheck?: boolean;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

// 선택형 칩의 단일 소스. 스타일 칩 / 필터 정렬·테마 / 리뷰 필터에서 모두 재사용.
export function Pill({
  active, onPress, label, emoji, icon, trailingCheck,
  variant = 'solid', size = 'sm', className = '',
}: PillProps) {
  const solid = variant === 'solid';
  const box = solid
    ? active ? 'border border-primary bg-primary' : 'border border-outline-variant bg-white'
    : active ? 'border-2 border-primary' : 'border border-outline-variant';
  const textColor = solid
    ? active ? 'text-white' : 'text-on-surface'
    : active ? 'text-primary' : 'text-on-surface';
  const pad = size === 'md' ? 'justify-center px-4 py-3.5' : 'px-[15px] py-[9px]';
  const textSize = size === 'md' ? 'text-[14px]' : 'text-[13.5px]';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-full active:opacity-80 ${box} ${pad} ${className}`}
    >
      {emoji ? <Text className="text-[15px]">{emoji}</Text> : null}
      {icon}
      <Text className={`font-bold ${textSize} ${textColor}`}>{label}</Text>
      {trailingCheck && active ? <CheckIcon size={16} color="#005049" strokeWidth={2.5} /> : null}
    </Pressable>
  );
}
