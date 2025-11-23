import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { PublicTeacherProfile } from '../../context/teachers/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const usePublicTeacherProfileApi = () => {
  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const getPublicTeacherProfile = async (
    teacherId: number
  ): Promise<{ success: boolean; message: string; data?: PublicTeacherProfile }> => {
    try {
      const res = await client.get(
        `/public/teachers/${teacherId}`
      );

      const raw: any = res.data;
      let data: PublicTeacherProfile | undefined;
      // Soportar dos formatos: objeto plano o envuelto en { success, data }
      if (raw && typeof raw === 'object') {
        if ('user_id' in raw) {
          data = raw as PublicTeacherProfile;
        } else if ('data' in raw) {
          data = raw.data as PublicTeacherProfile;
        }
      }

      return {
        success: !!data,
        message: raw?.message || 'Perfil público obtenido exitosamente',
        data,
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const status = axErr.response?.status;
      const message =
        axErr.response?.data?.detail ||
        axErr.response?.data?.message ||
        (status === 404 ? 'Perfil público no encontrado' : undefined) ||
        axErr.message ||
        'Error al obtener el perfil público del docente';
      return { success: false, message };
    }
  };

  return { getPublicTeacherProfile };
};
