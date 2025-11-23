import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PublicAgendaData, PublicAgendaResponse } from './types';
import { usePublicAgendaApi } from '../../hooks/availability/usePublicAgendaApi';

export interface PublicAgendaContextType {
  loading: boolean;
  error: string | null;
  agendaData: PublicAgendaData | null;
  fetchPublicAgenda: (
    teacherId: number,
    params?: { week?: string; start_date?: string; end_date?: string },
    options?: { force?: boolean }
  ) => Promise<{ success: boolean; data?: PublicAgendaResponse; message: string }>;
  resetStatus: () => void;
}

const PublicAgendaContext = createContext<PublicAgendaContextType | undefined>(undefined);

export const PublicAgendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getPublicAgenda } = usePublicAgendaApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agendaData, setAgendaData] = useState<PublicAgendaData | null>(null);
  const cacheRef = useRef<Map<string, PublicAgendaData>>(new Map());
  const inFlightRef = useRef<Set<string>>(new Set());

  const fetchPublicAgenda = useCallback(async (
    teacherId: number,
    params?: { week?: string; start_date?: string; end_date?: string },
    options?: { force?: boolean }
  ) => {
    const key = `${teacherId}|${params?.week ?? ''}|${params?.start_date ?? ''}|${params?.end_date ?? ''}`;

    // Cache guard
    if (!options?.force && cacheRef.current.has(key)) {
      setError(null);
      const cached = cacheRef.current.get(key)!;
      setAgendaData(cached);
      return { success: true, message: 'cached', data: { success: true, message: 'cached', data: cached } as PublicAgendaResponse };
    }

    // In-flight guard
    if (inFlightRef.current.has(key)) {
      return { success: true, message: 'in_flight', data: undefined } as any;
    }

    inFlightRef.current.add(key);
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicAgenda(teacherId, params);
      if (res.success && res.data) {
        cacheRef.current.set(key, res.data.data);
        setAgendaData(res.data.data);
      } else {
        setError(res.message);
      }
      return res as any;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener la agenda pública';
      setError(message);
      return { success: false, message } as any;
    } finally {
      inFlightRef.current.delete(key);
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
