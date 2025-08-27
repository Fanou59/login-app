import ky from "ky";

// Configuration de base de votre API
export const api = ky.create({
  prefixUrl: "http://127.0.0.1:8000/api", // Remplacez par votre URL d'API
  timeout: 10000,
  headers: {
    "Content-Type": "application/ld+json",
    Accept: "application/ld+json",
  },
});

export const createAuthenticatedApi = (token: string) => {
  return api.extend({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
