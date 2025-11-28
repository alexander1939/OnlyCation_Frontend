import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useConfirmationsApi } from '../../hooks/confirmations/useConfirmationsApi';
import type { ConfirmationDetailData, ConfirmationDetailResponse } from './types';

export interface ConfirmationDetailContextType {
  loading: boolean;
  error: string | null;
  detail: ConfirmationDetailData | null;
  fetchDetail: (confirmationId: number | string) => Promise<{ success: boolean; message: string; data?: ConfirmationDetailResponse }>; 
  resetDetail: () => void;
}

const ConfirmationDetailContext = createContext<ConfirmationDetailContextType | undefined>(undefined);

export const ConfirmationDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useConfirmationsApi();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConfirmationDetailData | null>(null);

  const fetchDetail = useCallback(async (confirmationId: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getConfirmationDetail(confirmationId);
      if (res.success && res.data?.data) {
        setDetail(res.data.data);
      } else {
        setError(res.message);
      }
      return res as { success: boolean; message: string; data?: ConfirmationDetailResponse };
    } catch (e: any) {
      const message = e?.message || 'Error al obtener el detalle de la confirmación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [api]);

  const resetDetail = useCallback(() => {
    setError(null);
    setDetail(null);
  }, []);

  const value = useMemo<ConfirmationDetailContextType>(() => ({ loading, error, detail, fetchDetail, resetDetail }), [loading, error, detail, fetchDetail, resetDetail]);

  return (
    <ConfirmationDetailContext.Provider value={value}>
      {children}
    </ConfirmationDetailContext.Provider>
  );
};

export const useConfirmationDetailContext = () => {
  const ctx = useContext(ConfirmationDetailContext);
  if (!ctx) throw new Error('useConfirmationDetailContext debe usarse dentro de ConfirmationDetailProvider');
  return ctx;
};

export const useOptionalConfirmationDetailContext = () => useContext(ConfirmationDetailContext);
