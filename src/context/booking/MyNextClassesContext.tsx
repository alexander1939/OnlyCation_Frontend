import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NextClass, MyNextClassesResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface MyNextClassesContextType {
  loading: boolean;
  error: string | null;
  classes: NextClass[];
  hasMore: boolean;
  fetchMyNextClasses: () => Promise<{ success: boolean; data?: MyNextClassesResponse; message: string }>;
  loadMoreClasses: () => Promise<void>;
  resetStatus: () => void;
}

const MyNextClassesContext = createContext<MyNextClassesContextType | undefined>(undefined);

export const MyNextClassesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getMyNextClasses } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<NextClass[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 6;

  const fetchMyNextClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffset(0);
    try {
      const res = await getMyNextClasses(LIMIT, 0);
      if (res.success && res.data) {
        // Ordenar clases: primero por fecha de inicio, luego por fecha de creación
        const sortedClasses = [...res.data.data].sort((a, b) => {
          const dateA = new Date(a.start_time).getTime();
          const dateB = new Date(b.start_time).getTime();
          
          // Si las fechas de inicio son iguales, ordenar por fecha de creación
          if (dateA === dateB && a.created_at && b.created_at) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          
          return dateA - dateB;
        });
        
        setClasses(sortedClasses);
        setHasMore(res.data.has_more ?? false);
        setOffset(LIMIT);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener las clases';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [getMyNextClasses, LIMIT]);

  const loadMoreClasses = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await getMyNextClasses(LIMIT, offset);
      if (res.success && res.data) {
        setClasses(prev => [...prev, ...res.data.data]);
        setHasMore(res.data.has_more ?? false);
        setOffset(prev => prev + LIMIT);
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      const message = e?.message || 'Error al cargar más clases';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [getMyNextClasses, loading, hasMore, offset, LIMIT]);

  const resetStatus = useCallback(() => {
    setError(null);
    setClasses([]);
    setHasMore(true);
    setOffset(0);
  }, []);

  const value = useMemo(
    () => ({ loading, error, classes, hasMore, fetchMyNextClasses, loadMoreClasses, resetStatus }),
    [loading, error, classes, hasMore, fetchMyNextClasses, loadMoreClasses, resetStatus]
  );

  return (
    <MyNextClassesContext.Provider value={value}>
      {children}
    </MyNextClassesContext.Provider>
  );
};

export const useMyNextClassesContext = (): MyNextClassesContextType => {
  const ctx = useContext(MyNextClassesContext);
  if (!ctx) throw new Error('useMyNextClassesContext must be used within a MyNextClassesProvider');
  return ctx;
};
