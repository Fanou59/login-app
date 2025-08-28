import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { useUserScreen } from "@/hooks/useWelcomeScreen";
import { useProfileFormStore } from "@/store/profilStore";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function EditProfileScreen() {
  const { handleDeleteAccount, user } = useUserScreen();
  const { token, updateUserData } = useAuth();

  const {
    firstname,
    lastname,
    email,
    errors,
    isLoading,
    setFirstname,
    setLastname,
    setEmail,
    initializeFromUser,
    validateForm,
    updateProfile,
  } = useProfileFormStore();

  useEffect(() => {
    if (user) {
      initializeFromUser(user);
    }
  }, [user, initializeFromUser]);

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }
    if (!token) {
      Alert.alert("Erreur", "Token d'authentification manquant");
      return;
    }

    // ✅ Vérifier que l'utilisateur a un ID
    if (!user?.id) {
      Alert.alert("Erreur", "ID utilisateur manquant");
      return;
    }

    const success = await updateProfile(token, user.id, (updateUser) => {
      updateUserData(updateUser);
    });

    if (success) {
      Alert.alert("Succès", "Votre profil a été mis à jour avec succès");
    } else {
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour");
    }
  };

  return (
    <VStack className="flex-1 pt-2 px-5">
      <VStack className="flex-1">
        <Heading size="2xl">Modifier le profil</Heading>
        <VStack space="md" className="mt-2">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Prénom</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Votre prénom"
                value={firstname}
                onChangeText={setFirstname}
                autoCapitalize="sentences"
                autoCorrect={false}
                keyboardType="default"
                accessibilityLabel="Champ prenom"
                accessibilityHint="Entrez votre prenom"
              />
            </Input>
            {errors.firstname && (
              <Text size="sm" className="text-red-500 mt-1">
                {errors.firstname}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Nom</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Votre nom"
                value={lastname}
                onChangeText={setLastname}
                autoCapitalize="sentences"
                autoCorrect={false}
                keyboardType="default"
                accessibilityLabel="Champ nom"
                accessibilityHint="Entrez votre nom"
              />
            </Input>
            {errors.lastname && (
              <Text size="sm" className="text-red-500 mt-1">
                {errors.lastname}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="john.doe@gmail.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel="Champ email"
                accessibilityHint="Entrez votre adresse email"
              />
            </Input>
            {errors.email && (
              <Text size="sm" className="text-red-500 mt-1">
                {errors.email}
              </Text>
            )}
          </FormControl>
          <Button
            onPress={handleSaveProfile}
            className={`mt-4 ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}
          >
            <ButtonText>
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
      <VStack className="pb-4">
        <Button onPress={handleDeleteAccount} action="negative">
          <ButtonText>Supprimer mon compte</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
