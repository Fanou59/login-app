import { Header } from "@/components/features/Header";
import { PasswordField } from "@/components/features/PasswordField";
import { TextField } from "@/components/features/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { useSignInLogic } from "@/hooks/useSignIn";
import { configureGoogle } from "@/lib/google-auth";

import { router } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

configureGoogle();

export default function SignIn() {
  const { isAuthenticated, isInitialized } = useAuth();
  const {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    handleGoogleLogin,
    handleSignUp,
    isLoading,
  } = useSignInLogic();

  useEffect(() => {
    if (isInitialized && isAuthenticated) router.replace("/(tabs)/home");
  }, [isAuthenticated, isInitialized]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initialisation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background-0"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <VStack className="flex-1">
          <Header />

          <VStack className="flex-1 justify-center px-8 pb-12" space="xl">
            <VStack space="xs" className="mb-2">
              <Heading size="3xl" className="text-typography-900">
                Se connecter
              </Heading>
              <Text size="md" className="text-typography-500">
                Connectez-vous pour accéder à Trail Ready
              </Text>
            </VStack>
            <VStack
              className="w-full rounded-2xl border border-outline-100 p-6 bg-background-50 shadow-sm"
              space="lg"
            >
              <VStack space="md">
                <TextField
                  label="E-mail"
                  placeholder="john.doe@gmail.com"
                  value={username}
                  onChangeText={setUsername}
                  accessibilityLabel="Champ email"
                  accessibilityHint="Entrez votre email"
                />
                <PasswordField
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                />
              </VStack>
              <VStack space="md" className="w-full mt-2">
                <Button
                  className={`w-full h-12 ${isLoading ? "opacity-50" : ""}`}
                  size="md"
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <ButtonText>Se connecter</ButtonText>
                </Button>
                <View className="flex-row items-center w-full my-4">
                  {/* Ligne gauche : elle prend tout l'espace disponible à gauche */}
                  <View className="flex-1 h-[1px] bg-outline-200" />

                  {/* Texte : On lui donne une largeur fixe ou un padding horizontal égal pour qu'il reste au milieu */}
                  <View className="px-4">
                    <Text
                      size="sm"
                      className="text-typography-400 font-medium text-center"
                      style={{
                        includeFontPadding: false,
                        minWidth: 30, // Assure que le texte a un espace dédié fixe
                      }}
                    >
                      OU
                    </Text>
                  </View>

                  {/* Ligne droite : elle prend tout l'espace disponible à droite (identique à la gauche) */}
                  <View className="flex-1 h-[1px] bg-outline-200" />
                </View>
                <Button
                  variant="outline"
                  action="secondary"
                  className="w-full h-12 border-outline-300"
                  onPress={handleGoogleLogin}
                >
                  {/* Tu peux ajouter une icône Google ici si tu en as une */}
                  <ButtonText className="text-typography-900">
                    Continuer avec Google
                  </ButtonText>
                </Button>
              </VStack>

              <HStack className="justify-center items-center mt-2" space="xs">
                <Text size="sm">Vous n&apos;avez pas de compte ?</Text>
                <Text
                  size="sm"
                  className="text-primary-500 font-semibold underline"
                  onPress={handleSignUp}
                >
                  Créer un compte
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
