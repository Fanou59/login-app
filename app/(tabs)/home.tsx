import { UserProfile } from "@/components/features/UserProfile";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useWelcomeScreen } from "@/hooks/useWelcomeScreen";
import { View } from "react-native";

export default function HomeScreen() {
  const { user, handleLogout, handleDeleteAccount } = useWelcomeScreen();

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
        <Button onPress={handleLogout}>
          <ButtonText>Se deconnecter</ButtonText>
        </Button>
        <Button onPress={handleDeleteAccount} action="negative">
          <ButtonText>Supprimer mon compte</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
