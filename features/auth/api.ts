import { httpClient } from '@shared/api';
import type { ApiResponse, TokenPair } from '@shared/types';
import type { User } from '@entities/user';

export interface EmailSignupRequest {
  email: string;
  password: string;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

export const authApi = {
  emailSignup: (body: EmailSignupRequest) =>
    httpClient.post<ApiResponse<AuthResponse>>('/auth/email/signup', body).then((r) => r.data),

  emailLogin: (body: EmailLoginRequest) =>
    httpClient.post<ApiResponse<AuthResponse>>('/auth/email/login', body).then((r) => r.data),

  kakaoLogin: (accessToken: string) =>
    httpClient.post<ApiResponse<AuthResponse>>('/auth/oauth/kakao', { accessToken }).then((r) => r.data),

  googleLogin: (idToken: string) =>
    httpClient.post<ApiResponse<AuthResponse>>('/auth/oauth/google', { idToken }).then((r) => r.data),

  me: () =>
    httpClient.get<ApiResponse<User>>('/auth/me').then((r) => r.data),

  logout: () =>
    httpClient.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),
};
