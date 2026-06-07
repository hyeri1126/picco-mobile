import { Pressable, Text, View } from 'react-native';

interface ChipItem {
  id: string | number;
  label: string;
}

interface ChipGroupProps {
  items: ChipItem[];
  selected: (string | number)[];
  onToggle: (id: string | number) => void;
  prefix?: string;
}

export function ChipGroup({ items, selected, onToggle, prefix = '' }: ChipGroupProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            className={`rounded-full px-4 py-2.5 active:opacity-80 ${
              active ? 'bg-primary' : 'bg-surface-container'
            }`}
          >
            <Text className={`typo-label-sm ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
              {prefix}
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
