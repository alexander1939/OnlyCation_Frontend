import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { WalletCreateRequest, WalletCreateResponse } from '../../context/cartera/types';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useAgendaApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const createWallet = async (
    walletData: WalletCreateRequest
  ): Promise<{ success: boolean; data?: WalletCreateResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.post<WalletCreateResponse>(
        '/wallet/create/',
        walletData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Cartera creada correctamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al crear la cartera';
      return { success: false, message };
    }
  };

  return { createWallet };
};
