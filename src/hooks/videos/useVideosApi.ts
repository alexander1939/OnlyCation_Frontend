import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type { VideoSaveRequest, VideoSaveResponse, VideoListResponse, VideoData, VideoUpdateRequest, VideoUpdateResponse } from '../../context/videos/types';

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

  const getMyVideoUrl = async (): Promise<{ success: boolean; message: string; data?: { embed_url: string; original_url: string } }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get<{ success: boolean; message: string; data: { embed_url: string; original_url: string } }>(
        '/videos/my-video-url/',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        message: res.data.message || 'Video obtenido exitosamente',
        data: res.data.data
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener el video';
      return { success: false, message };
    }
  };

  const getMyVideos = async (): Promise<{
    success: boolean;
    message: string;
    data?: VideoData[];
    total?: number;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get<VideoListResponse>(
        '/videos/my',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        message: res.data.message || 'Videos obtenidos exitosamente',
        data: res.data.data,
        total: res.data.total
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener los videos';
      return { success: false, message };
    }
  };

  const updateMyVideo = async (
    payload: VideoUpdateRequest
  ): Promise<{ success: boolean; data?: VideoUpdateResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.put<VideoUpdateResponse>(
        '/videos/my',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Video actualizado exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al actualizar el video';
      return { success: false, message };
    }
  };

  return { saveMyVideo, getMyVideoUrl, getMyVideos, updateMyVideo };
};
