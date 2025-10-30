import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { BookingPaymentResponse } from './types';
import { useAgendaApi } from '../../hooks/profile/useAgendaApi';

export interface BookingContextType {
  creating: boolean;
  error: string | null;
  success: boolean;
  lastResponse?: BookingPaymentResponse;
  createAvailability: (availabilityData: Record<string, any>) => Promise<{ success: boolean; data?: BookingPaymentResponse; message: string }>;
  resetStatus: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createAvailability } = useAgendaApi();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastResponse, setLastResponse] = useState<BookingPaymentResponse | undefined>(undefined);

  const createAvailabilityAction = useCallback(async (availabilityData: Record<string, any>) => {
    setCreating(true);
    setError(null);
    setSuccess(false);
    setLastResponse(undefined);
    try {
      const res = await createAvailability(availabilityData);
      setSuccess(res.success);
      if (!res.success) setError(res.message);
      if (res.data) setLastResponse(res.data);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al crear la disponibilidad';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setCreating(false);
    }
  }, [createAvailability]);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLastResponse(undefined);
  }, []);

  const value = useMemo(() => ({ creating, error, success, lastResponse, createAvailability: createAvailabilityAction, resetStatus }), [creating, error, success, lastResponse, createAvailabilityAction, resetStatus]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = (): BookingContextType => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookingContext must be used within a BookingProvider');
  return ctx;
};
