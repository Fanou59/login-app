import { PasswordField } from "@/components/features/PasswordField";
import { TextField } from "@/components/features/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileFormStore } from "@/store/profilStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Image, View } from "react-native";

export default function SignUp() {
  const {
    firstname,
    email,
    newPassword,
    confirmPassword,
    errors,
    setFirstname,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    validateForm,
    resetForm,
  } = useProfileFormStore();

  const { isLoading, error, clearError, isInitialized, registration } =
    useAuth();

  // Reset du formulaire au montage du composant
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Effacer les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, newPassword, error, clearError]);

  const handleLogin = () => {
    router.replace("/signIn");
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    const success = await registration(
      email.trim(),
      newPassword,
      firstname.trim()
    );

    if (success) {
      console.log("utilisateur enregistré");
      resetForm();
      Alert.alert("Succés", "Votre compte est créé", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    }
  };

  // 👈 Ajouter cet écran de chargement
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initialisation...</Text>
      </View>
    );
  }

  return (
    <VStack className="flex-1">
      <VStack className="items-center pt-16 pb-8">
        <Image
          source={require("@/assets/images/trail-ready-logo.png")}
          style={{
            width: 120,
            height: 120,
            resizeMode: "contain",
          }}
        />
      </VStack>
      <VStack className="flex-1 justify-start pt-4 px-8" space="md">
        <VStack space="xs">
          <Heading size="3xl">Créer un compte</Heading>
          <Text size="sm">Démarrer votre expérience Trail Ready</Text>
        </VStack>
        <VStack
          className="w-full rounded-md border border-background-200 p-4"
          space="md"
        >
          <TextField
            label="E-mail"
            placeholder="john.doe@gmail.com"
            value={email}
            error={errors.email}
            onChangeText={setEmail}
            accessibilityLabel="Champ email"
            accessibilityHint="Entrez votre email"
          />
          <TextField
            label="Prénom"
            placeholder="Votre prénom"
            value={firstname}
            onChangeText={setFirstname}
            error={errors.firstname}
            accessibilityLabel="Champ prenom"
            accessibilityHint="Entrez votre prenom"
          />
          <PasswordField
            label="Mot de passe"
            placeholder="Mot de passe"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <PasswordField
            label="Confirmez votre mot de passe"
            placeholder="Mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button
            className={`w-full mt-6 ${isLoading ? "opacity-50" : ""}`}
            size="md"
            onPress={handleRegistration}
            disabled={isLoading}
          >
            <ButtonText>Enregistrer</ButtonText>
          </Button>
          <HStack className="justify-center items-center mt-4" space="xs">
            <Text size="sm">Vous avez déjà un compte ?</Text>
            <Text
              size="sm"
              className="text-blue-500 underline"
              onPress={handleLogin}
            >
              Se connecter
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
