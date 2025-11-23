import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { BookingCreateRequest, BookingCreateResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface CreateBookingContextType {
  loading: boolean;
  error: string | null;
  result: BookingCreateResponse | null;
  createBooking: (payload: BookingCreateRequest) => Promise<{ success: boolean; data?: BookingCreateResponse; message: string }>;
  resetStatus: () => void;
}

const CreateBookingContext = createContext<CreateBookingContextType | undefined>(undefined);

export const CreateBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createBooking: apiCreateBooking } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingCreateResponse | null>(null);

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
  }, []);

  const value = useMemo(() => ({ loading, error, result, createBooking, resetStatus }), [loading, error, result, createBooking, resetStatus]);

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
