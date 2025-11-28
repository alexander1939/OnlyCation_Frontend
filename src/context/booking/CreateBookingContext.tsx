import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { BookingCreateRequest, BookingCreateResponse, BookingQuoteRequestMulti, BookingQuoteRequestSingle, BookingQuoteResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface CreateBookingContextType {
  loading: boolean;
  error: string | null;
  result: BookingCreateResponse | null;
  createBooking: (payload: BookingCreateRequest) => Promise<{ success: boolean; data?: BookingCreateResponse; message: string }>;
  resetStatus: () => void;
  // Cotización
  quoteLoading: boolean;
  quoteError: string | null;
  quoteResult: BookingQuoteResponse | null;
  quoteBooking: (payload: BookingQuoteRequestSingle | BookingQuoteRequestMulti) => Promise<{ success: boolean; data?: BookingQuoteResponse; message: string }>;
}

const CreateBookingContext = createContext<CreateBookingContextType | undefined>(undefined);

export const CreateBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createBooking: apiCreateBooking, quoteBooking: apiQuoteBooking } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingCreateResponse | null>(null);
  // Cotización
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<BookingQuoteResponse | null>(null);

  const createBooking = useCallback(async (payload: BookingCreateRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiCreateBooking(payload);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al crear la sesión de pago';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [apiCreateBooking]);

  const resetStatus = useCallback(() => {
    setError(null);
    setResult(null);
    setQuoteError(null);
    setQuoteResult(null);
  }, []);

  const quoteBooking = useCallback(async (payload: BookingQuoteRequestSingle | BookingQuoteRequestMulti) => {
    setQuoteLoading(true);
    setQuoteError(null);
    // No limpiamos quoteResult para evitar parpadeo en la UI mientras llega la nueva cotización
    try {
      const res = await apiQuoteBooking(payload);
      if (res.success && res.data) {
        setQuoteResult(res.data);
      } else {
        setQuoteError(res.message);
      }
      return res as { success: boolean; data?: BookingQuoteResponse; message: string };
    } catch (e: any) {
      const message = e?.message || 'Error al cotizar la reserva';
      setQuoteError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setQuoteLoading(false);
    }
  }, [apiQuoteBooking]);

  const value = useMemo(() => ({ 
    loading, error, result, createBooking, resetStatus,
    quoteLoading, quoteError, quoteResult, quoteBooking,
  }), [loading, error, result, createBooking, resetStatus, quoteLoading, quoteError, quoteResult, quoteBooking]);

  return (
    <CreateBookingContext.Provider value={value}>
      {children}
    </CreateBookingContext.Provider>
  );
};

export const useCreateBookingContext = (): CreateBookingContextType => {
  const ctx = useContext(CreateBookingContext);
  if (!ctx) throw new Error('useCreateBookingContext must be used within a CreateBookingProvider');
  return ctx;
};
