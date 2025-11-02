import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type { VideoSaveRequest, VideoSaveResponse } from '../../context/videos/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useVideosApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const saveMyVideo = async (
    payload: VideoSaveRequest
  ): Promise<{ success: boolean; data?: VideoSaveResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.post<VideoSaveResponse>(
        '/videos/create/my',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Video guardado exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al guardar el video';
      return { success: false, message };
    }
  };

  return { saveMyVideo };
};
