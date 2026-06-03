import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center gap-3 bg-background px-5">
      {/* text-primary → tailwind.config.js에 이식한 토큰 */}
      <Text className="text-3xl font-extrabold text-primary">Picco</Text>
      <Text className="text-xl font-bold text-on-surface">
        당신의 여행을 인생샷으로.
      </Text>

      <Pressable
        className="mt-2 self-start rounded-xl bg-primary px-5 py-3 active:opacity-80"
        onPress={() => console.log("검색 눌림")}
      >
        <Text className="font-bold text-white">검색</Text>
      </Pressable>
    </View>
  );
}
