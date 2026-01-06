import { useAuth } from "@/contexts/AuthContext";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useSignInLogic = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithToken, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    const success = await login(username.trim(), password);
    if (!success) {
      Alert.alert("Erreur", error || "Identifiants incorrects");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response: any = await GoogleSignin.signIn();
      const idToken = response.data?.idToken || response.idToken;

      if (idToken) {
        const apiResponse = await fetch(
          "http://localhost:8000/api/login/google",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          }
        );
        const result = await apiResponse.json();
        if (apiResponse.ok && result.token) {
          await loginWithToken(result.token, result.user);
        }
      }
    } catch (err: any) {
      if (err.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Erreur Google", err.message);
      }
    }
  };

  const handleSignUp = () => {
    router.replace("/signUp");
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    handleGoogleLogin,
    isLoading,
    handleSignUp,
  };
};
