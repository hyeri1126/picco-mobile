import { Pressable, ScrollView, Text } from 'react-native';

import { useThemes } from '@features/profile';

// Theme 엔티티엔 이모지가 없어 이름 기준으로 매핑 (없으면 기본 📷)
const THEME_EMOJI: Record<string, string> = {
  필름감성: '🎞️',
  아이폰감성: '📱',
  커플스냅: '💞',
  야경촬영: '🌃',
  인생샷: '✨',
  기념일: '🎉',
  화보형: '📸',
};

interface StylePillsProps {
  activeThemeId: string | null;
  onSelect: (themeId: string | null) => void;
}

export function StylePills({ activeThemeId, onSelect }: StylePillsProps) {
  const { data: themes = [] } = useThemes();
  if (themes.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-[9px] px-5 pb-1.5 pt-3.5"
    >
      {themes.map((t) => {
        const id = t.id as string;
        const active = activeThemeId === id;
        return (
          <Pressable
            key={id}
            onPress={() => onSelect(active ? null : id)}
            className={`flex-row items-center gap-1.5 rounded-full border px-[15px] py-[9px] active:opacity-80 ${
              active ? 'border-primary bg-primary' : 'border-outline-variant bg-white'
            }`}
          >
            <Text className="text-[15px]">{THEME_EMOJI[t.name] ?? '📷'}</Text>
            <Text className={`text-[13.5px] font-bold ${active ? 'text-white' : 'text-on-surface'}`}>
              {t.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
