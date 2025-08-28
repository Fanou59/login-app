import { UserProfile } from "@/components/features/UserProfile";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUserScreen } from "@/hooks/useWelcomeScreen";
import { View } from "react-native";

export default function HomeScreen() {
  const { user } = useUserScreen();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VStack space="md" reversed={false}>
        <UserProfile user={user} />
      </VStack>
    </View>
  );
}
