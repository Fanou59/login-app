import { Header } from "@/components/features/Header";
import { PasswordField } from "@/components/features/PasswordField";
import { TextField } from "@/components/features/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSignUp } from "@/hooks/useSignUp";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

export default function SignUp() {
  const { form, handleRegistration, goToSignIn, isLoading, isInitialized } =
    useSignUp();

  if (!isInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-background-0">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-typography-500">Initialisation...</Text>
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

          {/* Container centré verticalement */}
          <VStack className="flex-1 justify-center px-8 pb-12" space="xl">
            {/* Titre de la page */}
            <VStack space="xs" className="mb-2">
              <Heading size="3xl" className="text-typography-900">
                Créer un compte
              </Heading>
              <Text size="md" className="text-typography-500">
                Démarrez votre expérience Trail Ready
              </Text>
            </VStack>

            {/* Carte du formulaire d'inscription */}
            <VStack
              className="w-full rounded-2xl border border-outline-100 p-6 bg-background-50 shadow-sm"
              space="lg"
            >
              <VStack space="md">
                <TextField
                  label="E-mail"
                  placeholder="john.doe@gmail.com"
                  value={form.email}
                  error={form.errors.email}
                  onChangeText={form.setEmail}
                />
                <TextField
                  label="Prénom"
                  placeholder="Votre prénom"
                  value={form.firstname}
                  onChangeText={form.setFirstname}
                  error={form.errors.firstname}
                />
                <PasswordField
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  error={form.errors.newPassword}
                  value={form.newPassword}
                  onChangeText={form.setNewPassword}
                />
                <PasswordField
                  label="Confirmez votre mot de passe"
                  placeholder="Répétez le mot de passe"
                  error={form.errors.confirmPassword}
                  value={form.confirmPassword}
                  onChangeText={form.setConfirmPassword}
                />
              </VStack>

              <VStack space="md" className="w-full mt-2">
                <Button
                  className={`w-full h-12 ${isLoading ? "opacity-50" : ""}`}
                  size="md"
                  onPress={handleRegistration}
                  disabled={isLoading}
                >
                  <ButtonText>Enregistrer</ButtonText>
                </Button>

                <HStack className="justify-center items-center mt-2" space="xs">
                  <Text size="sm" className="text-typography-500">
                    Vous avez déjà un compte ?
                  </Text>
                  <Text
                    size="sm"
                    className="text-primary-500 font-semibold underline"
                    onPress={goToSignIn}
                  >
                    Se connecter
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
