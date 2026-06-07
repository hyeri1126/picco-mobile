import { usePathname, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Polygon, Polyline } from 'react-native-svg';

import { ROUTES, href } from '@shared/config';

type IconProps = { color: string };

const TABS = [
  { id: 'home', label: '홈', path: ROUTES.home, Icon: HomeIcon },
  { id: 'explore', label: '실시간', path: null, Icon: ZapIcon },
  { id: 'chat', label: '채팅', path: null, Icon: ChatIcon },
  { id: 'profile', label: '프로필', path: null, Icon: UserIcon },
] as const;

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t border-outline-variant bg-white px-1 pt-2"
      style={{ paddingBottom: insets.bottom + 10 }}
    >
      {TABS.map((tab) => {
        const active = tab.path != null && pathname.startsWith(tab.path);
        const color = active ? '#005049' : 'rgba(62,73,71,0.6)';
        return (
          <Pressable
            key={tab.id}
            disabled={tab.path == null}
            onPress={() => tab.path && router.replace(href(tab.path))}
            className="flex-1 items-center gap-[3px] active:opacity-70"
          >
            <tab.Icon color={color} />
            <Text className="text-[11px] font-semibold" style={{ color }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function HomeIcon({ color }: IconProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="9 22 9 12 15 12 15 22" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function ZapIcon({ color }: IconProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChatIcon({ color }: IconProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UserIcon({ color }: IconProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
