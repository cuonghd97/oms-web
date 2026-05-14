import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import type { User, TokenResponse, LoginRequest, RegisterRequest } from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<TokenResponse>>('/api/v1/auth/login', data).then((r) => r.data.data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<User>>('/api/v1/auth/register', data).then((r) => r.data.data),

  me: () =>
    apiClient.get<ApiResponse<User>>('/api/v1/auth/me').then((r) => r.data.data),

  logout: () =>
    apiClient.post('/api/v1/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<TokenResponse>>('/api/v1/auth/refresh-token', { refreshToken }).then((r) => r.data.data),
};
