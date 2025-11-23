import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { VerifyBookingResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface VerifyBookingContextType {
  loading: boolean;
  error: string | null;
  result: VerifyBookingResponse | null;
  verifyBooking: (sessionId: string) => Promise<{ success: boolean; data?: VerifyBookingResponse; message: string }>;
  resetStatus: () => void;
}

const VerifyBookingContext = createContext<VerifyBookingContextType | undefined>(undefined);

export const VerifyBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { verifyBooking: apiVerify } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyBookingResponse | null>(null);

  const verifyBooking = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiVerify(sessionId);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al verificar el pago del booking';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [apiVerify]);

  const resetStatus = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  const value = useMemo(() => ({ loading, error, result, verifyBooking, resetStatus }), [loading, error, result, verifyBooking, resetStatus]);

  return (
    <VerifyBookingContext.Provider value={value}>
      {children}
    </VerifyBookingContext.Provider>
  );
};

export const useVerifyBookingContext = (): VerifyBookingContextType => {
  const ctx = useContext(VerifyBookingContext);
  if (!ctx) throw new Error('useVerifyBookingContext must be used within a VerifyBookingProvider');
  return ctx;
};

