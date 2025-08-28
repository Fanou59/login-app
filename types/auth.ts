export interface User {
  id: string;
  name?: string;
  email: string;
  username?: string;
  firstname: string;
  lastname?: string;
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
  refresh_token: string;
}
export interface RegistrationRequest {
  email: string;
  plainPassword: string;
  firstname?: string;
}

export interface RegistrationResponse {
  id: string;
  username: string;
  email: string;
}
