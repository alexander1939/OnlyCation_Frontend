import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { 
  MyNextClassesResponse, 
  BookingDetailResponse, 
  BookingCreateRequest, 
  BookingCreateResponse, 
  VerifyBookingResponse, 
  BookingQuoteRequestSingle, 
  BookingQuoteRequestMulti, 
  BookingQuoteResponse 
} from '../../context/booking/types';
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

  const quoteBooking = async (payload: BookingQuoteRequestSingle | BookingQuoteRequestMulti): Promise<{
    success: boolean;
    data?: BookingQuoteResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      try { console.log('[BookingApi][DEBUG] POST /bookings/cotizar-booking/ payload:', payload); } catch {}

      const response = await client.post<BookingQuoteResponse>(
        `/bookings/cotizar-booking/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      try { console.log('[BookingApi][DEBUG] quoteBooking response:', response.data); } catch {}

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Cotización obtenida correctamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al cotizar el booking';
      return { success: false, message };
    }
  };

  type RescheduleItem = {
    availability_id: number;
    start_time: string; // ISO 8601 HH:00:00
    end_time: string;   // ISO 8601 HH:00:00
  };
  type RescheduleRequestSingle = {
    booking_id: number;
    new_availability_id: number;
    new_start_time: string; // ISO 8601 HH:00:00
    new_end_time: string;   // ISO 8601 HH:00:00
  };
  type RescheduleRequestMulti = {
    booking_id: number;
    items: RescheduleItem[]; // tramos contiguos por hora
  };
  type RescheduleRequest = RescheduleRequestSingle | RescheduleRequestMulti;
  type RescheduleResponse = {
    success: boolean;
    message: string;
    data?: {
      booking_id: number;
      old_start_time: string;
      old_end_time: string;
      new_start_time: string;
      new_end_time: string;
      teacher_name?: string;
      updated_at?: string;
      can_reschedule_again?: boolean;
    };
  };

  const rescheduleBooking = async (payload: RescheduleRequest): Promise<{ success: boolean; data?: RescheduleResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.put<RescheduleResponse>(
        `/bookings/reagendar-booking/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      return {
        success: !!data?.success,
        data,
        message: data?.message ?? 'Reserva reagendada exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al reagendar la reserva';
      return { success: false, message };
    }
  };

  return { 
    getMyNextClasses, 
    getMyAllClasses, 
    searchMyClasses, 
    getBookingDetail, 
    createBooking, 
    verifyBooking, 
    quoteBooking,
    rescheduleBooking,
  };
};
