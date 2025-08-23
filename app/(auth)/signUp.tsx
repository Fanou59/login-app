import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
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

  const { isLoading, error, clearError, isInitialized, registration } =
    useAuth();

  // Effacer les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, error, clearError]);

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
        <Button
          className="w-fit self-end mt-4"
          size="sm"
          onPress={handleRegistration}
          disabled={isLoading}
        >
          <ButtonText>Enregistrer</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
