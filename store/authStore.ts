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
  registration: (
    email: string,
    plainPassword: string,
    firstname: string
  ) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  setUser: (user: User | null) => void;
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

          if (error.response?.status === 401) {
            errorMessage = "Email ou mot de passe incorrect";
          } else if (error.response?.status === 500) {
            errorMessage = "Erreur serveur, veuillez réessayer";
          } else if (error.message?.includes("401")) {
            // Fallback si error.response n'est pas disponible
            errorMessage = "Email ou mot de passe incorrect";
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
      logout: async () => {
        const { token } = get(); // 👈 Récupérer les DEUX tokens

        try {
          if (token) {
            // 👈 Vérifier qu'on a les deux
            console.log("Appel API pour invalider le Token");
            await authAPI.logout(token); // 👈 Passer les deux tokens
            console.log("Logout API call successful");
          }
        } catch (error) {
          console.log("Logout - erreur", error);
        }

        // Nettoyage
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        });
        console.log("Etat local nettoyé");
      },

      // Action de registration
      registration: async (
        email: string,
        plainPassword: string,
        firstname: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.registration({
            email,
            plainPassword,
            firstname,
          });
          console.log("Enregistrement réussi - Réponse API : ", response);

          // 👈 NOUVEAU : Connexion automatique après inscription réussie
          console.log("Registration - Tentative de connexion automatique");

          // Appeler la fonction login avec les mêmes identifiants
          const { login } = get();
          const loginSuccess = await login(email, plainPassword);

          if (loginSuccess) {
            console.log("Registration - Connexion automatique réussie");
            set({
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            // Si la connexion automatique échoue, on considère quand même l'inscription comme réussie
            console.log(
              "Registration - Connexion automatique échouée, mais inscription OK"
            );
            set({
              isLoading: false,
              error: null,
            });
            return true;
          }
        } catch (error: any) {
          let errorMessage = "Erreur d'inscription";

          if (error.response) {
            const status = error.response.status;

            if (status === 400) {
              errorMessage = "Données d'inscription invalides";
            } else if (status === 500) {
              errorMessage = "Erreur serveur, veuillez réessayer";
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
            user: null,
          });

          return false;
        }
      },

      setUser: (user: User | null) => {
        set({ user });
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

      deleteAccount: async () => {
        const { token, user } = get();

        if (!token || !user?.id) {
          console.log("DeleteAccount - Token ou ID utilisateur manquant");
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          console.log("DeleteAccount - Suppression du compte ID:", user.id);

          // Étape 1 : Supprimer le compte
          await authAPI.deleteAccount(token, user.id);
          console.log("DeleteAccount - Compte supprimé avec succès");

          // Étape 3 : Nettoyer l'état local
          set({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });

          console.log("DeleteAccount - Compte supprimé et état local nettoyé");
          return true;
        } catch (error: any) {
          console.log("DeleteAccount - Erreur:", error);

          let errorMessage = "Erreur lors de la suppression du compte";

          if (error.response) {
            const status = error.response.status;
            if (status === 401) {
              errorMessage = "Non autorisé à supprimer ce compte";
            } else if (status === 404) {
              errorMessage = "Compte non trouvé";
            } else if (status === 403) {
              errorMessage = "Accès interdit";
            } else if (status === 500) {
              errorMessage = "Erreur serveur, veuillez réessayer";
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
          });

          return false;
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
