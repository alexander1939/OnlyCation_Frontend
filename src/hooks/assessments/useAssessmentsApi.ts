import { useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useAssessmentsApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => axios.create({ baseURL: API_URL }), []);

  const getMyRating = useCallback(async (): Promise<{ success: boolean; message: string; data?: { average_rating: number } }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get<{ success: boolean; message: string; data: { average_rating: number } }>(
        '/assessments/my-rating/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        success: true,
        message: res.data.message || 'Promedio de calificación obtenido exitosamente',
        data: res.data.data
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener calificación';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  return { getMyRating };
};
