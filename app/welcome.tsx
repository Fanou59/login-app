import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { View } from "react-native";

export default function WelcomeScreen() {
  // Vous pouvez récupérer le nom d'utilisateur depuis votre état global, AsyncStorage, etc.
  const userName = "Stéphane"; // À remplacer par votre logique de récupération

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VStack space="md" reversed={false}>
        <Text size="xl">Bienvenue !</Text>
        <Text size="lg">Bonjour {userName}</Text>
      </VStack>
    </View>
  );
}
