import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { BookingPaymentResponse } from '../../context/booking/types';
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

      const response = await client.post<BookingPaymentResponse>(
        '/availability/create/',
        availabilityData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Disponibilidad creada exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al crear la disponibilidad';
      return { success: false, message };
    }
  };

  return { createAvailability };
};

