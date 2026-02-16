// shared/types/auth.types.ts

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data: {
    _id: string;
    username: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}