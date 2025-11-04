import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { BookingPaymentResponse } from '../../context/availability/types';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useAgendaApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const createAvailability = async (
    availabilityData: Record<string, any>
  ): Promise<{ success: boolean; data?: BookingPaymentResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      console.log(' Enviando al backend /availability/create/:', availabilityData);

      const response = await client.post<BookingPaymentResponse>(
        '/availability/create/',
        availabilityData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      console.log(' Respuesta del backend:', data);
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Disponibilidad creada exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al crear la disponibilidad';
      console.error(' Error del backend:', axErr.response?.data);
      return { success: false, message };
    }
  };

  const fetchAvailabilityList = async (): Promise<{ 
    success: boolean; 
    data?: any; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get('/availability/list/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      return {
        success: !!data?.success,
        data: data?.data,
        message: data?.message ?? 'Disponibilidades obtenidas exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener disponibilidades';
      return { success: false, message };
    }
  };

  const deleteAvailability = async (availabilityId: number): Promise<{ 
    success: boolean; 
    data?: any; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.delete(`/availability/delete/${availabilityId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      return {
        success: !!data?.success,
        data: data?.data,
        message: data?.message ?? 'Horario eliminado exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al eliminar horario';
      return { success: false, message };
    }
  };

  const fetchWeeklyAgenda = async (startDate: string, endDate: string): Promise<{ 
    success: boolean; 
    data?: any; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get('/availability/agenda/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { start_date: startDate, end_date: endDate }
      });

      const data = response.data;
      return {
        success: !!data?.success,
        data: data?.data,
        message: data?.message ?? 'Agenda obtenida exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener agenda';
      return { success: false, message };
    }
  };

  return { createAvailability, fetchAvailabilityList, deleteAvailability, fetchWeeklyAgenda };
};
