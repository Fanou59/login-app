import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export const useUserScreen = () => {
  const { user, logout, isAuthenticated, deleteAccount } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.log("Erreur lors de la connexion : ", error);
      router.replace("/");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAccount();
            if (success) {
              Alert.alert(
                "Compte supprimé",
                "Votre compte a été supprimé avec succès.",
                [{ text: "OK", onPress: () => router.replace("/") }]
              );
            }
          },
        },
      ]
    );
  };

  return {
    user,
    handleLogout,
    handleDeleteAccount,
  };
};
