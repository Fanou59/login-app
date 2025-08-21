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
          console.log("Tentative de connexion avec:", { username });

          const response = await authAPI.login({ username, password });
          console.log("Réponse API :", response);

          // Décoder le JWT pour extraire les infos utilisateur
          const decodedToken = decodeJWT(response.token);
          console.log("Token décodé:", decodedToken);

          // Créer l'objet user à partir du JWT
          const user: User = {
            id: decodedToken?.username || username, // Utiliser username comme ID
            name: decodedToken?.username?.split("@")[0] || "Utilisateur", // Nom à partir de l'email
            email: decodedToken?.username || username,
            username: decodedToken?.username || username,
          };

          console.log("User créé:", user);

          set({
            user,
            token: response.token,
            refreshToken: response.refresh_token, // 👈 Utiliser refresh_token avec underscore
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          console.log("Erreur complète:", error);
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
          console.log("Erreur lors du refresh token:", error);
          set({ user: null, token: null, refreshToken: null });
          return false;
        }
      },

      // Action de déconnexion
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.log("Erreur lors de la déconnexion:", error);
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        });
      },

      // Effacer les erreurs
      clearError: () => {
        set({ error: null });
      },

      // Vérifier l'authentification
      checkAuth: async () => {
        const { token } = get();

        if (!token) return;

        // Pour l'instant, on vérifie juste si le token est valide en le décodant
        try {
          const decodedToken = decodeJWT(token);
          if (decodedToken && decodedToken.exp > Date.now() / 1000) {
            // Token valide, recréer l'user
            const user: User = {
              id: decodedToken.username,
              name: decodedToken.username?.split("@")[0] || "Utilisateur",
              email: decodedToken.username,
              username: decodedToken.username,
            };
            set({ user });
          } else {
            // Token expiré
            set({ user: null, token: null, refreshToken: null });
          }
        } catch (error) {
          console.log("Token invalide", error);
          set({ user: null, token: null, refreshToken: null });
        }
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
