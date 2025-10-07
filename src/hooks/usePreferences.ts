import { useCallback, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from './useAuth';
import type {
  PreferenceCreateRequest,
  PreferenceCreateResponse,
} from '../context/preferences/types';

// API configuration from environment (same pattern used in auth API)
const envApiUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
const API_BASE_URL = envApiUrl && envApiUrl.trim().length > 0 ? envApiUrl : '/api';
if (!envApiUrl) {
  // eslint-disable-next-line no-console
  console.warn('[PreferencesAPI] VITE_API_URL no está definido. Usando fallback \'/api\'. Configura tu .env a partir de .envExample');
}

export interface UsePreferencesState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UsePreferencesReturn extends UsePreferencesState {
  createPreferences: (preferenceData: PreferenceCreateRequest) => Promise<PreferenceCreateResponse | null>;
}

export const usePreferences = (): UsePreferencesReturn => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const createPreferences = useCallback(
    async (preferenceData: PreferenceCreateRequest): Promise<PreferenceCreateResponse | null> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
        }

        const response = await client.post<PreferenceCreateResponse>(
          '/preferences/create/',
          preferenceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        setSuccess(!!data?.success);
        return data;
      } catch (err) {
        const axErr = err as AxiosError<{ detail?: string }>;
        const message = axErr.response?.data?.detail || axErr.message || 'Error creando preferencias';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [client, getAccessToken]
  );

  return {
    loading,
    error,
    success,
    createPreferences,
  };
};
