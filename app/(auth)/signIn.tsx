import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    isInitialized,
  } = useAuth();

  //Redirection automatique si utilisateur déjà loggué
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      console.log("Redirection vers /welcome");
      router.replace("/welcome");
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
        alignItems: "center",
        padding: 20,
      }}
    >
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
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
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
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            ></InputField>
          </Input>
        </FormControl>

        {/* Affichage des erreurs */}
        {error && (
          <Text size="sm" className="text-red-500 text-center">
            {error}
          </Text>
        )}
        <HStack space="md" className="flex justify-end">
          <Button
            className="w-fit self-end mt-4"
            size="sm"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ButtonText>Se connecter</ButtonText>
          </Button>
          <Button
            className="w-fit self-end mt-4"
            size="sm"
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <ButtonText>{`S'inscrire`}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </View>
  );
}
