import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShow = () => {
    setShowPassword((showPassword) => {
      return !showPassword;
    });
  };

  const { isLoading, error, clearError, isInitialized, registration } =
    useAuth();

  // Effacer les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, error, clearError]);
  const handleLogin = () => {
    router.replace("/signIn");
  };

  const handleRegistration = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tout les champs");
      return;
    }
    const success = await registration(
      email.trim(),
      password,
      firstname.trim()
    );

    if (success) {
      console.log("utilisateur enregistré");

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <VStack space="md">
        <VStack space="xs">
          <Heading size="3xl">Créer un compte</Heading>
          <Text size="sm">&apos;expérience Trail Ready</Text>
        </VStack>
        <VStack
          className="w-full rounded-md border border-background-200 p-4"
          space="md"
        >
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Entrez votre E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              ></InputField>
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Entrez votre Prénom</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Prénom"
                value={firstname}
                onChangeText={setFirstname}
                autoCapitalize="words"
                autoCorrect={false}
                keyboardType="default"
              ></InputField>
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>
                Entrez votre mot de passe
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <InputSlot className="pr-3" onPress={handleShow}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
          </FormControl>

          {/* Affichage des erreurs */}
          {error && (
            <Text size="sm" className="text-red-500 text-center">
              {error}
            </Text>
          )}
          <Button
            className="mt-4"
            size="sm"
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
    </View>
  );
}
