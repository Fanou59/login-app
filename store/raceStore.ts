import type { Race } from "@/types/race";

import { raceService } from "@/lib/race.service";
import { create } from "zustand";

interface RaceState {
  races: Race[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRaces: (token: string) => Promise<void>;
  addRace: (token: string, raceData: Omit<Race, "id">) => Promise<boolean>;
  resetRaces: () => void;
  removeRace: (token: string, id: string | number) => Promise<boolean>;
  archiveRace: (token: string, id: string | number) => Promise<boolean>;
}

export const useRaceStore = create<RaceState>((set, get) => ({
  races: [],
  isLoading: false,
  error: null,

  // Récupérer toutes les courses
  fetchRaces: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await raceService.getAllRaces(token);

      // 🕵️ Debug: Regarde ce qui s'affiche dans ton terminal Metro
      console.log("Réponse API brute:", JSON.stringify(response, null, 2));

      // API Platform met les résultats dans hydra:member
      const data =
        response["member"] ||
        response["hydra:member"] ||
        (Array.isArray(response) ? response : []);

      set({ races: data, isLoading: false });
    } catch (err: any) {
      console.error("Erreur fetchRaces:", err);
      set({ error: "Erreur lors de la récupération", isLoading: false });
    }
  },

  // Ajouter une course
  addRace: async (token: string, raceData: Omit<Race, "id">) => {
    set({ isLoading: true, error: null });
    try {
      await raceService.createRace(token, raceData);

      // Après l'ajout, on rafraîchit la liste pour être synchro avec la DB
      await get().fetchRaces(token);

      set({ isLoading: false });
      return true;
    } catch (err: any) {
      console.error("Erreur API Race:", err);
      set({ error: "Impossible de créer la course", isLoading: false });
      return false;
    }
  },

  // Nettoyer le store (utile lors de la déconnexion)
  resetRaces: () => set({ races: [], error: null, isLoading: false }),

  removeRace: async (token: string, id: string | number) => {
    set({ isLoading: true });
    try {
      await raceService.deleteRace(token, id);

      // Mise à jour locale : on filtre le tableau pour enlever la course supprimée
      // sans avoir besoin de refaire un fetch complet
      const currentRaces = get().races;
      set({
        races: currentRaces.filter((race) => race.id !== id),
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      console.error("Erreur suppression:", err);
      set({ isLoading: false });
      return false;
    }
  },
  archiveRace: async (token: string, id: string | number) => {
    set({ isLoading: true });
    try {
      // On envoie archive: true à la base de données
      await raceService.updateRace(token, id, { archive: true });

      // On retire la course de la liste affichée (puisque ce sont les courses "à venir")
      const currentRaces = get().races;
      set({
        races: currentRaces.filter((race) => race.id !== id),
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      console.error("Erreur archivage:", err);
      set({ isLoading: false });
      return false;
    }
  },
}));
