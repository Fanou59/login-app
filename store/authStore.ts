import { authAPI } from "@/lib/endpoints";
import { decodeJWT } from "@/lib/jwt";
import type { User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  // État
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  fetchUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Action de connexion
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.login({ username, password });

          // Stocker d'abord le token
          set({
            token: response.token,
            refreshToken: response.refresh_token,
            isLoading: false,
            error: null,
          });

          const { fetchUserProfile } = get();
          await fetchUserProfile();

          return true;
        } catch (error: any) {
          let errorMessage = "Erreur de connexion";

          if (error.response) {
            const status = error.response.status;
            if (status === 401) {
              errorMessage = "Email ou mot de passe incorrect";
            } else if (status === 500) {
              errorMessage = "Erreur serveur, veuillez réessayer";
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            token: null,
            refreshToken: null,
          });
          return false;
        }
      },

      // Action de refresh du token
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          set({ user: null, token: null, refreshToken: null });
          return false;
        }

        try {
          const response = await authAPI.refreshToken(refreshToken);

          // Décoder le nouveau token pour mettre à jour l'user si nécessaire
          const decodedToken = decodeJWT(response.token);
          const user: User = {
            id: decodedToken?.username,
            name: decodedToken?.username?.split("@")[0] || "Utilisateur",
            email: decodedToken?.username,
            username: decodedToken?.username,
          };

          set({
            user,
            token: response.token,
            refreshToken: response.refresh_token, // Adapter si votre API refresh retourne aussi refresh_token
          });

          return true;
        } catch (error) {
          set({ user: null, token: null, refreshToken: null });
          console.log("Erreur lors du refresh token:", error);
          return false;
        }
      },

      // Action de déconnexion
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        });
        console.log("Etat local nettoyé");
      },

      // Effacer les erreurs
      clearError: () => {
        set({ error: null });
      },

      //Action pour récupérer le profil de l'utilisateur
      fetchUserProfile: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await authAPI.me(token);
          set({ user: response });
          console.log(response);
        } catch (error) {
          console.log("Erreur lors de la récupération du profil:", error);
        }
      },

      // Vérifier l'authentification
      checkAuth: async () => {
        const { token, fetchUserProfile } = get();

        if (!token) return;
        await fetchUserProfile();
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
