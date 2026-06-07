import { ScrollView } from 'react-native';

interface HorizontalScrollProps {
  children: React.ReactNode;
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-[11px] px-[18px] pb-1"
    >
      {children}
    </ScrollView>
  );
}
