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
      return {
        success: !!res.data?.success,
        message: res.data?.message || 'Comentarios obtenidos exitosamente',
        data: res.data?.data,
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const status = axErr.response?.status;
      const message =
        axErr.response?.data?.detail ||
        axErr.response?.data?.message ||
        (status === 404 ? 'El docente no tiene comentarios públicos' : undefined) ||
        axErr.message ||
        'Error al obtener los comentarios públicos';
      return { success: false, message };
    }
  };

  return { getPublicComments };
};
