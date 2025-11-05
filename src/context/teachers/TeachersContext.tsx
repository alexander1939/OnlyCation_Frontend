import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { TeachersContextType } from './types';
import { useTeachersApi, type SearchTeachersParams, type Teacher } from '../../hooks/teachers/useTeachersApi';

const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export const TeachersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getTeachers: apiGetTeachers, searchTeachers: apiSearchTeachers } = useTeachersApi();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const getTeachers = useCallback(async (page?: number, pageSize?: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetTeachers(page, pageSize);
      if (res?.success) {
        setTeachers(res.data);
        setTotal(res.total);
        setPage(res.page);
        setPageSize(res.page_size);
        setTotalPages(res.total_pages);
      } else {
        setError(res?.message || 'No se pudieron obtener los profesores');
        setTeachers([]);
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [apiGetTeachers]);

  const searchTeachers = useCallback(async (params?: SearchTeachersParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiSearchTeachers(params);
      if (res?.success) {
        setTeachers(res.data);
        setTotal(res.total);
        setPage(res.page);
        setPageSize(res.page_size);
        setTotalPages(res.total_pages);
      } else {
        setError(res?.message || 'No se pudieron obtener los profesores');
        setTeachers([]);
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [apiSearchTeachers]);

  const clearResults = useCallback(() => {
    setTeachers([]);
    setTotal(0);
    setPage(1);
    setPageSize(12);
    setTotalPages(0);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ teachers, loading, error, total, page, pageSize, totalPages, getTeachers, searchTeachers, clearResults }),
    [teachers, loading, error, total, page, pageSize, totalPages, getTeachers, searchTeachers, clearResults]
  );

  return (
    <TeachersContext.Provider value={value}>
      {children}
    </TeachersContext.Provider>
  );
};

export const useTeachersContext = (): TeachersContextType => {
  const ctx = useContext(TeachersContext);
  if (!ctx) throw new Error('useTeachersContext must be used within a TeachersProvider');
  return ctx;
};
