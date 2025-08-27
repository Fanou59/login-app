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
import { Alert, Image, View } from "react-native";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    isInitialized,
  } = useAuth();

  const handleShow = () => {
    setShowPassword((showPassword) => {
      return !showPassword;
    });
  };

  //Redirection automatique si utilisateur déjà loggué
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      console.log("Redirection vers /home");
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isInitialized]);

  // Effacer les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [username, password, clearError]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tout les champs");
      return;
    }

    const success = await login(username.trim(), password);

    if (success) {
      console.log("connexion réussie");
    }
  };

  const handleSignUp = () => {
    router.replace("/signUp");
  };

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
          <Heading size="3xl">Se connecter</Heading>
          <Text size="sm">Connectez-vous pour accéder à Trail Ready</Text>
        </VStack>
        <VStack
          className="w-full rounded-md border border-background-200 p-4"
          space="md"
        >
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="john.doe@gmail.com"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel="Champ email"
                accessibilityHint="Entrez votre adresse email"
              ></InputField>
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Mot de passe</FormControlLabelText>
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
          <VStack space="md" className="w-full">
            <Button
              className={`w-full mt-6 ${isLoading ? "opacity-50" : ""}`}
              size="md"
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ButtonText>Se connecter</ButtonText>
            </Button>
            <HStack className="justify-center items-center mt-4" space="xs">
              <Text size="sm">Vous n&apos;avez pas de compte ?</Text>
              <Text
                size="sm"
                className="text-blue-500 underline"
                onPress={handleSignUp}
              >
                Créer un compte
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
