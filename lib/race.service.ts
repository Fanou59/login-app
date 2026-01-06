import type { Race } from "@/types/race";
import { createAuthenticatedApi } from "./api";

export const raceService = {
  // Récupérer toutes les courses
  getAllRaces: (token: string) =>
    createAuthenticatedApi(token).get("races").json<any>(),

  // Récupérer une seule course
  getRaceById: (token: string, id: string) =>
    createAuthenticatedApi(token).get(`races/${id}`).json<Race>(),

  // Créer une course
  createRace: (token: string, data: Omit<Race, "id">) =>
    createAuthenticatedApi(token).post("races", { json: data }).json<Race>(),

  // Supprimer une course
  deleteRace: (token: string, id: string | number) =>
    createAuthenticatedApi(token).delete(`races/${id}`).json(),

  updateRace: (token: string, id: string | number, data: Partial<Race>) =>
    createAuthenticatedApi(token)
      .patch(`races/${id}`, {
        json: data,
        headers: {
          // ⚠️ Indispensable pour API Platform sur une requête PATCH
          "Content-Type": "application/merge-patch+json",
        },
      })
      .json<Race>(),
};
