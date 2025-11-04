import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { WeeklyAgendaResponse, DeleteAvailabilityPayload, DeleteAvailabilityResponse } from '../../context/availability/types';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useWeeklyAgendaApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const getWeeklyAgenda = async (): Promise<{ 
    success: boolean; 
    data?: WeeklyAgendaResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<WeeklyAgendaResponse>(
        '/availability/agenda/',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Agenda obtenida exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener la agenda';
      return { success: false, message };
    }
  };

  const deleteAvailability = async (
    availabilityId: number, 
    payload: DeleteAvailabilityPayload
  ): Promise<{ 
    success: boolean; 
    data?: DeleteAvailabilityResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.delete<DeleteAvailabilityResponse>(
        `/availability/delete/${availabilityId}/`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          data: payload
        }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Disponibilidad eliminada exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al eliminar disponibilidad';
      return { success: false, message };
    }
  };

  return { getWeeklyAgenda, deleteAvailability };
};
