import { authAPI } from "@/lib/endpoints";
import { useAuthStore } from "@/store/authStore";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  registration: (
    email: string,
    plainPassword: string,
    firstname: string
  ) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
  updateUserData: (newUserData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    user,
    token,
    isLoading,
    error,
    login: storeLogin,
    logout,
    clearError,
    checkAuth,
    registration: storeRegistration,
    deleteAccount: storeDeleteAccount,
    setUser,
  } = useAuthStore();

  // Vérifier l'auth au démarrage
  useEffect(() => {
    const initAuth = async () => {
      // Petit délai pour s'assurer que le layout est prêt
      await new Promise((resolve) => setTimeout(resolve, 100));
      await checkAuth();
      setIsInitialized(true);
    };

    initAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    return await storeLogin(username, password);
  };

  const registration = async (
    email: string,
    plainPassword: string,
    firstname: string
  ) => {
    return await storeRegistration(email, plainPassword, firstname);
  };

  const deleteAccount = async () => {
    return await storeDeleteAccount();
  };

  // ✅ Nouvelle méthode pour recharger le profil utilisateur
  const refreshUserProfile = useCallback(async () => {
    if (!token) return;

    try {
      const userData = await authAPI.me(token);
      setUser(userData);
      console.log("Profil utilisateur rechargé:", userData);
    } catch (error) {
      console.error("Erreur lors du rechargement du profil:", error);
    }
  }, [token, setUser]);

  // ✅ Méthode pour mettre à jour l'utilisateur directement
  const updateUserData = useCallback(
    (newUserData: any) => {
      console.log(
        "AuthContext - Mise à jour des données utilisateur:",
        newUserData
      );
      setUser(newUserData);
    },
    [setUser]
  );

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        isInitialized,
        login,
        logout,
        clearError,
        registration,
        deleteAccount,
        refreshUserProfile,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
};
