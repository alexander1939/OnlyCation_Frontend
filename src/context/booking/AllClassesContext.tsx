import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NextClass, MyNextClassesResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface SearchParams {
  status?: string;
  date_from?: string;
  min_price?: number;
}

export interface AllClassesContextType {
  loading: boolean;
  error: string | null;
  classes: NextClass[];
  hasMore: boolean;
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  fetchAllClasses: (params?: SearchParams) => Promise<{ success: boolean; data?: MyNextClassesResponse; message: string }>;
  loadMoreClasses: () => Promise<void>;
  resetStatus: () => void;
}

const AllClassesContext = createContext<AllClassesContextType | undefined>(undefined);

export const AllClassesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { searchMyClasses } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<NextClass[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const LIMIT = 6;

  const fetchAllClasses = useCallback(async (params?: SearchParams) => {
    setLoading(true);
    setError(null);
    setOffset(0);
    
    const finalParams = params || searchParams;
    setSearchParams(finalParams);
    
    try {
      const res = await searchMyClasses({
        ...finalParams,
        limit: LIMIT,
        offset: 0
      });
      
      if (res.success && res.data) {
        setClasses(res.data.data);
        setHasMore(res.data.has_more ?? false);
        setOffset(LIMIT);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener todas las clases';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [searchMyClasses, searchParams, LIMIT]);

  const loadMoreClasses = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await searchMyClasses({
        ...searchParams,
        limit: LIMIT,
        offset
      });
      
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
  }, [searchMyClasses, loading, hasMore, offset, searchParams, LIMIT]);

  const resetStatus = useCallback(() => {
    setError(null);
    setClasses([]);
    setHasMore(true);
    setOffset(0);
    setSearchParams({});
  }, []);

  const value = useMemo(
    () => ({ loading, error, classes, hasMore, searchParams, setSearchParams, fetchAllClasses, loadMoreClasses, resetStatus }),
    [loading, error, classes, hasMore, searchParams, fetchAllClasses, loadMoreClasses, resetStatus]
  );

  return (
    <AllClassesContext.Provider value={value}>
      {children}
    </AllClassesContext.Provider>
  );
};

export const useAllClassesContext = (): AllClassesContextType => {
  const ctx = useContext(AllClassesContext);
  if (!ctx) throw new Error('useAllClassesContext must be used within an AllClassesProvider');
  return ctx;
};
