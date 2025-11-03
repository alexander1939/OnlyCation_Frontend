import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { BookingDetailData, BookingDetailResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface BookingDetailContextType {
  loading: boolean;
  error: string | null;
  bookingDetail: BookingDetailData | null;
  fetchBookingDetail: (bookingId: number) => Promise<{ success: boolean; data?: BookingDetailResponse; message: string }>;
  resetStatus: () => void;
}

const BookingDetailContext = createContext<BookingDetailContextType | undefined>(undefined);

export const BookingDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getBookingDetail } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetail, setBookingDetail] = useState<BookingDetailData | null>(null);

  const fetchBookingDetail = useCallback(async (bookingId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBookingDetail(bookingId);
      if (res.success && res.data?.data) {
        setBookingDetail(res.data.data);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener el detalle de la reserva';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [getBookingDetail]);

  const resetStatus = useCallback(() => {
    setError(null);
    setBookingDetail(null);
  }, []);

  const value = useMemo(
    () => ({ loading, error, bookingDetail, fetchBookingDetail, resetStatus }),
    [loading, error, bookingDetail, fetchBookingDetail, resetStatus]
  );

  return (
    <BookingDetailContext.Provider value={value}>
      {children}
    </BookingDetailContext.Provider>
  );
};

export const useBookingDetailContext = (): BookingDetailContextType => {
  const ctx = useContext(BookingDetailContext);
  if (!ctx) throw new Error('useBookingDetailContext must be used within a BookingDetailProvider');
  return ctx;
};
