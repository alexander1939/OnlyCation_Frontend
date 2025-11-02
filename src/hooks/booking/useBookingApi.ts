import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { MyNextClassesResponse, BookingDetailResponse } from '../../context/booking/types';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useBookingApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const getMyNextClasses = async (): Promise<{ 
    success: boolean; 
    data?: MyNextClassesResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<MyNextClassesResponse>(
        '/bookings/my-next-classes/',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Clases obtenidas exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener las clases';
      return { success: false, message };
    }
  };

  const getBookingDetail = async (bookingId: number): Promise<{ 
    success: boolean; 
    data?: BookingDetailResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<BookingDetailResponse>(
        `/bookings/${bookingId}/detalle/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Detalle obtenido exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener el detalle';
      return { success: false, message };
    }
  };

  return { getMyNextClasses, getBookingDetail };
};
