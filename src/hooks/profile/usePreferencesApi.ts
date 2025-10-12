import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { PreferenceCreateRequest, PreferenceCreateResponse } from '../../context/preferences/types';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string;

export const usePreferencesApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const createPreferences = async (
    preferenceData: PreferenceCreateRequest
  ): Promise<{ success: boolean; data?: PreferenceCreateResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.post<PreferenceCreateResponse>(
        '/profile/preferences/create/',
        preferenceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Preferencias creadas correctamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>; 
      const message = axErr.response?.data?.detail || axErr.message || 'Error al crear las preferencias';
      return { success: false, message };
    }
  };

  return { createPreferences };
};
