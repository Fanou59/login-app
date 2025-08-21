import { useAuthStore } from "@/store/authStore";
import React, {
  createContext,
  ReactNode,
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
