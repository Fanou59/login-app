import { PasswordField } from "@/components/features/PasswordField";
import { TextField } from "@/components/features/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
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
    newPassword,
    confirmPassword,
    setFirstname,
    setLastname,
    setEmail,
    initializeFromUser,
    validateForm,
    updateProfile,
    setNewPassword,
    setConfirmPassword,
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
          <TextField
            label="Prénom"
            placeholder="Votre prénom"
            value={firstname}
            onChangeText={setFirstname}
            error={errors.firstname}
            accessibilityLabel="Champ prenom"
            accessibilityHint="Entrez votre prenom"
          />

          <TextField
            label="Nom"
            placeholder="Votre nom"
            value={lastname}
            onChangeText={setLastname}
            error={errors.lastname}
            accessibilityLabel="Champ nom"
            accessibilityHint="Entrez votre nom"
          />

          <TextField
            label="E-mail"
            placeholder="john.doe@gmail.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Champ email"
            accessibilityHint="Entrez votre adresse email"
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
