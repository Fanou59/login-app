import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function WelcomeScreen() {
  // Vous pouvez récupérer le nom d'utilisateur depuis votre état global, AsyncStorage, etc.
  const { user, logout, isAuthenticated } = useAuth(); // À remplacer par votre logique de récupération
  // Redirection si pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.log("Erreur lors de la deconnexion :", error);
      router.replace("/");
    }
  };

  // Affichage de chargement si pas encore d'utilisateur
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
        <Text size="xl">Bienvenue !</Text>
        <Text size="lg">
          Bonjour {user.firstName}
          {user.lastName ? ` ${user.lastName}` : ""}
        </Text>
        <Button onPress={handleLogout}>
          <ButtonText>Se deconnecter</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
