import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { isLoading } = useLocalSearchParams<{ isLoading: string }>();

  return (
    <SafeAreaView className="bg-primary h-full">
     <ScrollView contentContainerStyle={{ height: "100%" }}>
      <View className="flex-1 items-center justify-center px-8 gap-y-5">
        <Heart size={100} fill="white" color="white" />
        <Text className="text-white text-6xl font-f600 text-center">Kiss You</Text>
        {isLoading === 'true' && (
          <ActivityIndicator size="large" color="white" />
        )}
      </View>
     </ScrollView>
    </SafeAreaView>
  );
}
