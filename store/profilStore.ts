import { authAPI } from "@/lib/endpoints";
import { create } from "zustand";

interface ProfileFormState {
  // État des champs
  firstname: string;
  lastname: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  // État de validation
  errors: {
    firstname?: string;
    lastname?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  isLoading: boolean;

  // Actions pour mettre à jour les champs
  setFirstname: (firstname: string) => void;
  setLastname: (lastname: string) => void;
  setEmail: (email: string) => void;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;

  // Actions pour la validation
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;

  // Actions utilitaires
  resetForm: () => void;
  initializeFromUser: (user: any) => void;
  validateForm: () => boolean;

  // Action de sauvegarde du profil
  updateProfile: (
    token: string,
    userId: string,
    onSuccess?: (user: any) => void
  ) => Promise<boolean>;
}

export const useProfileFormStore = create<ProfileFormState>((set, get) => ({
  // État initial
  firstname: "",
  lastname: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  errors: {},
  isLoading: false,

  // Actions pour mettre à jour les champs
  setFirstname: (firstname: string) => {
    set({ firstname });
    // Effacer l'erreur du champ si elle existe
    const { clearFieldError } = get();
    clearFieldError("firstname");
  },

  setLastname: (lastname: string) => {
    set({ lastname });
    const { clearFieldError } = get();
    clearFieldError("lastname");
  },

  setEmail: (email: string) => {
    set({ email });
    const { clearFieldError } = get();
    clearFieldError("email");
  },

  setCurrentPassword: (password: string) => {
    set({ currentPassword: password });
    const { clearFieldError } = get();
    clearFieldError("currentPassword");
  },

  setNewPassword: (password: string) => {
    set({ newPassword: password });
    const { clearFieldError } = get();
    clearFieldError("newPassword");
  },

  setConfirmPassword: (password: string) => {
    set({ confirmPassword: password });
    const { clearFieldError } = get();
    clearFieldError("confirmPassword");
  },

  // Actions pour la gestion des erreurs
  setFieldError: (field: string, error: string) => {
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    }));
  },

  clearFieldError: (field: string) => {
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[field as keyof typeof newErrors];
      return { errors: newErrors };
    });
  },

  clearAllErrors: () => {
    set({ errors: {} });
  },

  // Actions utilitaires
  resetForm: () => {
    set({
      firstname: "",
      lastname: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errors: {},
    });
  },

  initializeFromUser: (user: any) => {
    set({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errors: {},
    });
  },

  validateForm: () => {
    const state = get();
    const newErrors: any = {};

    // Validation de l'email
    if (!state.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation du prénom
    if (!state.firstname.trim()) {
      newErrors.firstname = "Le prénom est requis";
    }

    // Validation des mots de passe si ils sont renseignés
    if (state.newPassword && state.newPassword !== state.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (state.newPassword && state.newPassword.length < 6) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    set({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  },

  // ✅ CORRECTION - Solution alternative : recharger le profil après la mise à jour
  updateProfile: async (
    token: string,
    userId: string,
    onSuccess?: (user: any) => void
  ) => {
    const state = get();
    set({ isLoading: true, errors: {} });

    try {
      // Préparer les données avec le bon mapping pour l'API
      const updateData: any = {
        firstname: state.firstname.trim(),
        email: state.email.trim(),
      };

      // Ajouter lastname si présent
      if (state.lastname.trim()) {
        updateData.lastname = state.lastname.trim();
      }

      // Ajouter le mot de passe si changé
      if (state.newPassword) {
        updateData.plainPassword = state.newPassword;
      }

      console.log("Données envoyées:", updateData);

      // 1. Mettre à jour le profil
      const response = await authAPI.updateProfile(token, userId, updateData);
      console.log("Profil mis à jour - Réponse API:", response);

      // 2. ✅ SOLUTION : Recharger le profil complet après la mise à jour
      console.log("Rechargement du profil complet...");
      const updatedUser = await authAPI.me(token);
      console.log("Profil rechargé:", updatedUser);

      // 3. Appeler le callback avec les données complètes
      if (onSuccess && updatedUser) {
        console.log(
          "Appel du callback onSuccess avec les données complètes:",
          updatedUser
        );
        onSuccess(updatedUser); // ✅ Une seule fois
      }

      // Réinitialiser les mots de passe après succès
      set({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      console.error("Erreur mise à jour profil:", error);
      set({
        errors: { email: error.message || "Erreur lors de la mise à jour" },
        isLoading: false,
      });
      return false;
    }
  },
}));
