import { useAuth } from "@/contexts/AuthContext";
import { useProfileFormStore } from "@/store/profilStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export const useSignUp = () => {
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

  // Reset au montage
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Nettoyage des erreurs API pendant la saisie
  useEffect(() => {
    if (error) clearError();
  }, [email, newPassword, error, clearError]);

  const handleRegistration = async () => {
    if (!validateForm()) return;

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
      resetForm();
      Alert.alert("Succès", "Votre compte est créé", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } else {
      Alert.alert("Erreur", error || "Erreur lors de la création de compte");
    }
  };

  const goToSignIn = () => router.replace("/signIn");

  return {
    form: {
      firstname,
      email,
      newPassword,
      confirmPassword,
      errors,
      setFirstname,
      setEmail,
      setNewPassword,
      setConfirmPassword,
    },
    handleRegistration,
    goToSignIn,
    isLoading,
    isInitialized,
  };
};
