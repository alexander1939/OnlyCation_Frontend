import { useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type { ApiResponse } from '../../context/prices/types';
import type { PriceCreateRequest, PriceMeta } from '../../context/prices/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const usePricesApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => axios.create({ baseURL: API_URL }), []);

  const createPrice = useCallback(async (payload: PriceCreateRequest): Promise<ApiResponse<PriceMeta>> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.post<ApiResponse<PriceMeta>>(
        '/prices/create/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data;
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al crear el precio';
      return { success: false, message } as ApiResponse<PriceMeta>;
    }
  }, [client, getAccessToken]);

  return { createPrice };
};
