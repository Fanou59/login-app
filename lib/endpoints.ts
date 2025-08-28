import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegistrationRequest,
  RegistrationResponse,
  User,
} from "@/types/auth";
import { api, createAuthenticatedApi, createAuthenticatedApiJSON } from "./api";

export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post("login_check", { json: credentials }).json<LoginResponse>(),

  me: (token: string) => createAuthenticatedApi(token).post("me").json<User>(),

  registration: (data: RegistrationRequest) =>
    api.post("users", { json: data }).json<RegistrationResponse>(),

  refreshToken: (refreshToken: string) =>
    api
      .post("token/refresh", {
        json: { refresh_token: refreshToken },
      })
      .json<RefreshTokenResponse>(),

  logout: (token: string) =>
    createAuthenticatedApi(token).post("logout").json(),

  deleteAccount: (token: string, userId: string) =>
    createAuthenticatedApi(token).delete(`users/${userId}`).json(),

  // ✅ Nouveau endpoint pour mettre à jour le profil
  updateProfile: (token: string, userId: string, data: any) =>
    createAuthenticatedApiJSON(token)
      .patch(`users/${userId}`, { json: data })
      .json<User>(),
};
