import { raceService } from "@/lib/race.service";
import { useAuthStore } from "@/store/authStore";
import type { Race } from "@/types/race";
import { Alert } from "react-native";
import { create } from "zustand";

interface RaceState {
  races: Race[];
  isLoading: boolean;
  error: string | null;

  // ✅ Déclarations pour TypeScript
  _getAuthToken: () => string | null;
  _handleUnauthorized: () => void;

  // Actions
  fetchRaces: () => Promise<void>;
  addRace: (raceData: Omit<Race, "id">) => Promise<boolean>;
  removeRace: (id: string | number) => Promise<boolean>;
  archiveRace: (id: string | number) => Promise<boolean>;
  resetRaces: () => void;
}

export const useRaceStore = create<RaceState>((set, get) => ({
  races: [],
  isLoading: false,
  error: null,

  // Récupère le token actuel
  _getAuthToken: () => useAuthStore.getState().token,

  // ✅ Logique de redirection en cas de 401
  _handleUnauthorized: () => {
    Alert.alert(
      "Session expirée",
      "Votre session a expiré. Veuillez vous reconnecter."
    );

    // On vide le token dans l'authStore (ce qui déclenche la redirection)
    // On utilise setState au cas où la fonction logout n'est pas définie
    useAuthStore.setState({ token: null, user: null });

    // On nettoie aussi les courses locales
    get().resetRaces();
  },

  fetchRaces: async () => {
    const token = get()._getAuthToken();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await raceService.getAllRaces(token);
      const data = response["member"] || response["hydra:member"] || [];
      set({ races: data, isLoading: false });
    } catch (err: any) {
      if (err.response?.status === 401) {
        get()._handleUnauthorized();
      } else {
        set({ error: "Erreur de récupération", isLoading: false });
      }
    }
  },

  addRace: async (raceData) => {
    const token = get()._getAuthToken();
    if (!token) return false;

    set({ isLoading: true });
    try {
      await raceService.createRace(token, raceData);
      await get().fetchRaces();
      return true;
    } catch (err: any) {
      if (err.response?.status === 401) {
        get()._handleUnauthorized();
      }
      set({ isLoading: false });
      return false;
    }
  },

  removeRace: async (id) => {
    const token = get()._getAuthToken();
    if (!token) return false;

    set({ isLoading: true });
    try {
      await raceService.deleteRace(token, id);
      set({
        races: get().races.filter((race) => race.id !== id),
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      if (err.response?.status === 401) get()._handleUnauthorized();
      set({ isLoading: false });
      return false;
    }
  },

  archiveRace: async (id) => {
    const token = get()._getAuthToken();
    if (!token) return false;

    set({ isLoading: true });
    try {
      await raceService.updateRace(token, id, { archive: true });
      set({
        races: get().races.filter((race) => race.id !== id),
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      if (err.response?.status === 401) get()._handleUnauthorized();
      set({ isLoading: false });
      return false;
    }
  },

  resetRaces: () => set({ races: [], error: null, isLoading: false }),
}));
