import { api } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from "@/types/auth";

export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post("login_check", { json: credentials }).json<LoginResponse>(),

  logout: () => api.post("auth/logout").json(),

  me: () => api.get("auth/me").json<{ user: User }>(),

  // 👈 Nouvel endpoint pour refresh token
  refreshToken: (refreshToken: string) =>
    api
      .post("token/refresh", {
        json: { refresh_token: refreshToken },
      })
      .json<RefreshTokenResponse>(),
};
