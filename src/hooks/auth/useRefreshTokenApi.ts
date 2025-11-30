// src/hooks/auth/useRefreshTokenApi.ts
import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim();
if (!API_BASE_URL) {
  throw new Error('❌ Faltó definir VITE_API_URL en tu archivo .env');
}

export interface RefreshTokenPayload {
  token: string;
}

export interface RefreshTokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status?: string;
  preference_id?: number | null;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: RefreshTokenData;
}

export const useRefreshTokenApi = () => {
  const client = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const refresh = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const res = await client.post<RefreshTokenResponse>('/auth/refresh-token/', { token: refreshToken } as RefreshTokenPayload);
      return res.data;
    } catch (err) {
      const ax = err as AxiosError<{ message?: string }>;
      return {
        success: false,
        message: ax.response?.data?.message || ax.message || 'Error al renovar token',
      };
    }
  };

  return { refresh };
};
