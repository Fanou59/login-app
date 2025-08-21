export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string; // 👈 Probablement pareil pour le refresh
}
