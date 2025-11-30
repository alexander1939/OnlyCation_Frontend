import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { PublicAssessmentComment } from '../../context/assessments/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const usePublicAssessmentsApi = () => {
  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const getPublicComments = async (
    teacherId: number
  ): Promise<{ success: boolean; message: string; data?: PublicAssessmentComment[] }> => {
    try {
      const res = await client.get<{ success: boolean; message: string; data: PublicAssessmentComment[] }>(
        `/assessments/public/comments/${teacherId}`
      );
      // Normalize: if API returns success but no data, treat as empty list to cache "no comments"
      return {
        success: true,
        message: res.data?.message || 'Comentarios obtenidos exitosamente',
        data: Array.isArray(res.data?.data) ? res.data.data : [],
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const status = axErr.response?.status;
      // If 404, consider it as "no comments" and return empty array to allow caching and avoid repeated calls
      if (status === 404) {
        const message = axErr.response?.data?.detail || axErr.response?.data?.message || 'El docente no tiene comentarios públicos';
        return { success: true, message, data: [] };
      }
      const message =
        axErr.response?.data?.detail ||
        axErr.response?.data?.message ||
        axErr.message ||
        'Error al obtener los comentarios públicos';
      return { success: false, message };
    }
  };

  return { getPublicComments };
};
