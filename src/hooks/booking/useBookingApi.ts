import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { MyNextClassesResponse, BookingDetailResponse, BookingCreateRequest, BookingCreateResponse, VerifyBookingResponse } from '../../context/booking/types';
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

  const getMyNextClasses = async (limit: number = 6, offset: number = 0): Promise<{ 
    success: boolean; 
    data?: MyNextClassesResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<MyNextClassesResponse>(
        `/bookings/my-next-classes/?limit=${limit}&offset=${offset}`,
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

  const getMyAllClasses = async (limit: number = 6, offset: number = 0): Promise<{ 
    success: boolean; 
    data?: MyNextClassesResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<MyNextClassesResponse>(
        `/bookings/my-classes/?limit=${limit}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Todas las clases obtenidas exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener todas las clases';
      return { success: false, message };
    }
  };

  const searchMyClasses = async (params: {
    status?: string;
    date_from?: string;
    min_price?: number;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ 
    success: boolean; 
    data?: MyNextClassesResponse; 
    message: string 
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
      queryParams.append('limit', (params.limit ?? 6).toString());
      queryParams.append('offset', (params.offset ?? 0).toString());

      const response = await client.get<MyNextClassesResponse>(
        `/bookings/my-classes/search/?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Búsqueda completada exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al buscar clases';
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

  const createBooking = async (payload: BookingCreateRequest): Promise<{
    success: boolean;
    data?: BookingCreateResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.post<BookingCreateResponse>(
        `/bookings/crear-booking/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Sesión de pago creada exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al crear la sesión de pago';
      return { success: false, message };
    }
  };

  const verifyBooking = async (sessionId: string): Promise<{
    success: boolean;
    data?: VerifyBookingResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<VerifyBookingResponse>(
        `/bookings/verificar-booking/${encodeURIComponent(sessionId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Booking payment verified successfully',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al verificar el pago del booking';
      return { success: false, message };
    }
  };

  return { getMyNextClasses, getMyAllClasses, searchMyClasses, getBookingDetail, createBooking, verifyBooking };
};
