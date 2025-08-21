import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from "@/types/auth";
import { api, createAuthenticatedApi } from "./api";

export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post("login_check", { json: credentials }).json<LoginResponse>(),

  me: (token: string) => createAuthenticatedApi(token).post("me").json<User>(),

  // 👈 Nouvel endpoint pour refresh token
  refreshToken: (refreshToken: string) =>
    api
      .post("token/refresh", {
        json: { refresh_token: refreshToken },
      })
      .json<RefreshTokenResponse>(),
};
