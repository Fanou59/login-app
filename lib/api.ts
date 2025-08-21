import { useAuthStore } from "@/store/authStore";
import ky from "ky";

// Configuration de base de votre API
export const api = ky.create({
  prefixUrl: "http://127.0.0.1:8001/api", // Remplacez par votre URL d'API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Récupérer le token depuis le store Zustand
        const token = useAuthStore.getState().token;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // Si 401, essayer de refresh le token
        if (response.status === 401) {
          const { refreshAccessToken } = useAuthStore.getState();
          const refreshSuccess = await refreshAccessToken();

          if (refreshSuccess) {
            // Retry la requête avec le nouveau token
            const newToken = useAuthStore.getState().token;
            if (newToken) {
              request.headers.set("Authorization", `Bearer ${newToken}`);
              return ky(request);
            }
          }
        }
        return response;
      },
    ],
  },
});
