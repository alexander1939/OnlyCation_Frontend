import { useCallback, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { PreferenceCreateRequest, PreferenceCreateResponse } from '../../context/preferences/types';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const BASE_URL = API_URL && API_URL.trim().length > 0 ? API_URL : '/api';

export interface UsePreferencesState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const usePreferences = () => {
  const { getAccessToken } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // const [preferences, setPreferences] = useState<PreferenceData | null>(null); // deshabilitado temporalmente

  const client = useMemo(() => {
    return axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const createPreferences = useCallback(
    async (
      preferenceData: PreferenceCreateRequest
    ): Promise<{ success: boolean; data?: PreferenceCreateResponse; message: string }> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
        }

        const response = await client.post<PreferenceCreateResponse>(
          '/profile/preferences/create/',
          preferenceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        setSuccess(!!data?.success);
        return {
          success: true,
          data,
          message: data?.message ?? 'Preferencias creadas correctamente',
        };
      } catch (err) {
        const axErr = err as AxiosError<{ detail?: string }>;
        const message = axErr.response?.data?.detail || axErr.message || 'Error al crear las preferencias';
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [client, getAccessToken]
  );

  // getMyPreferences y updateMyPreferences deshabilitados temporalmente

  return {
    loading,
    error,
    success,
    createPreferences,
    // preferences,
    // getMyPreferences,
    // updateMyPreferences,
  };
};
