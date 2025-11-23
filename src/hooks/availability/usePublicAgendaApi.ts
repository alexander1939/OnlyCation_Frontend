import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { PublicAgendaResponse } from '../../context/availability/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const usePublicAgendaApi = () => {
  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  type PublicAgendaQuery = { week?: string; start_date?: string; end_date?: string };

  const getPublicAgenda = async (
    teacherId: number,
    params?: PublicAgendaQuery
  ): Promise<{ 
    success: boolean; 
    data?: PublicAgendaResponse; 
    message: string 
  }> => {
    try {
      const response = await client.get<PublicAgendaResponse>(
        `/availability/docente/${teacherId}/agenda/`,
        { params }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Agenda pública obtenida exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener la agenda pública';
      return { success: false, message };
    }
  };

  return { getPublicAgenda };
};
