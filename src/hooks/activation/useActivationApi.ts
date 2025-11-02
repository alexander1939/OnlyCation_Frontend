import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';

export interface ActivationCheckData {
  [key: string]: any;
  is_active?: boolean;
  has_preferences?: boolean;
  has_documents?: boolean;
  has_price?: boolean;
  has_video?: boolean;
  has_availability?: boolean;
  has_wallet?: boolean;
}

export interface ActivationCheckResponse {
  success: boolean;
  message?: string;
  data?: ActivationCheckData;
}

export interface ActivationPerformResponse {
  success: boolean;
  message?: string;
  data?: ActivationCheckData;
}

const API_URL = import.meta.env.VITE_API_URL as string;

export const useActivationApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => axios.create({ baseURL: API_URL }), []);

  const checkActivation = async (): Promise<ActivationCheckData> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const res = await client.get<ActivationCheckResponse>('/activation/teacher/check', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.data) return res.data.data;
      // Soportar payload plano
      if ((res.data as unknown as ActivationCheckData)?.is_active !== undefined) {
        return res.data as unknown as ActivationCheckData;
      }
      throw new Error(res.data?.message || 'No se pudo consultar el estado de activación');
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      throw new Error(axErr.response?.data?.detail || axErr.message || 'Error al consultar activación');
    }
  };

  const activateTeacher = async (): Promise<ActivationCheckData> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const res = await client.post<ActivationPerformResponse>(
        '/activation/teacher/activate',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success && res.data.data) return res.data.data;
      throw new Error(res.data?.message || 'No se pudo activar la cuenta del docente');
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      throw new Error(axErr.response?.data?.detail || axErr.message || 'Error al activar la cuenta');
    }
  };

  return { checkActivation, activateTeacher };
};
