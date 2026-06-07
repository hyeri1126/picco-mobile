import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { ArrowLeftIcon } from '@shared/ui';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  divider?: boolean;
}

export function Header({ title, onBack, divider = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View
      className={`relative flex-row items-center px-4 pt-4 pb-2 ${
        divider ? 'border-b border-outline-variant/40' : ''
      }`}
    >
      <Pressable onPress={onBack ?? (() => router.back())} className="z-10 p-2 active:opacity-60">
        <ArrowLeftIcon />
      </Pressable>
      {title ? (
        <Text className="typo-headline-md absolute inset-x-0 text-center text-on-surface">
          {title}
        </Text>
      ) : null}
    </View>
  );
}
