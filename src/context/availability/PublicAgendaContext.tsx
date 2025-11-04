import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PublicAgendaData, PublicAgendaResponse } from './types';
import { usePublicAgendaApi } from '../../hooks/availability/usePublicAgendaApi';

export interface PublicAgendaContextType {
  loading: boolean;
  error: string | null;
  agendaData: PublicAgendaData | null;
  fetchPublicAgenda: (teacherId: number) => Promise<{ success: boolean; data?: PublicAgendaResponse; message: string }>;
  resetStatus: () => void;
}

const PublicAgendaContext = createContext<PublicAgendaContextType | undefined>(undefined);

export const PublicAgendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getPublicAgenda } = usePublicAgendaApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agendaData, setAgendaData] = useState<PublicAgendaData | null>(null);

  const fetchPublicAgenda = useCallback(async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicAgenda(teacherId);
      if (res.success && res.data) {
        setAgendaData(res.data.data);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener la agenda pública';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [getPublicAgenda]);

  const resetStatus = useCallback(() => {
    setError(null);
    setAgendaData(null);
  }, []);

  const value = useMemo(
    () => ({ loading, error, agendaData, fetchPublicAgenda, resetStatus }),
    [loading, error, agendaData, fetchPublicAgenda, resetStatus]
  );

  return (
    <PublicAgendaContext.Provider value={value}>
      {children}
    </PublicAgendaContext.Provider>
  );
};

export const usePublicAgendaContext = (): PublicAgendaContextType => {
  const ctx = useContext(PublicAgendaContext);
  if (!ctx) throw new Error('usePublicAgendaContext must be used within a PublicAgendaProvider');
  return ctx;
};
