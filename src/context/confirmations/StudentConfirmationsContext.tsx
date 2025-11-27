import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useConfirmationsApi } from '../../hooks/confirmations/useConfirmationsApi';
import type {
  StudentConfirmationPostResponse,
  StudentHistoryRecentResponse,
  StudentHistoryAllResponse,
  ConfirmationHistoryItem,
  StudentHistoryByDateResponse,
} from './types';

export interface StudentConfirmationsContextType {
  // submit
  submitLoading: boolean;
  submitError: string | null;
  submitResult: StudentConfirmationPostResponse | null;
  submitStudentConfirmation: (
    paymentBookingId: number | string,
    payload: { confirmation: boolean; description_student: string; evidence_file: File | Blob }
  ) => Promise<{ success: boolean; data?: StudentConfirmationPostResponse; message: string }>;

  // recent
  recentLoading: boolean;
  recentError: string | null;
  recentItems: ConfirmationHistoryItem[];
  loadStudentRecent: () => Promise<{ success: boolean; data?: StudentHistoryRecentResponse; message: string }>;

  // all
  allLoading: boolean;
  allError: string | null;
  allItems: ConfirmationHistoryItem[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
  loadStudentAll: (
    offset?: number,
    limit?: number
  ) => Promise<{ success: boolean; data?: StudentHistoryAllResponse; message: string }>;

  // by-date
  dateLoading: boolean;
  dateError: string | null;
  dateItems: ConfirmationHistoryItem[];
  loadStudentByDate: (dateStr: string) => Promise<{ success: boolean; data?: StudentHistoryByDateResponse; message: string }>;

  // evidence convenience
  getStudentEvidenceUrl: (confirmationId: number) => Promise<{ success: boolean; url?: string; message: string }>;

  resetSubmit: () => void;
}

const StudentConfirmationsContext = createContext<StudentConfirmationsContextType | undefined>(undefined);

export const StudentConfirmationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useConfirmationsApi();

  // submit
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<StudentConfirmationPostResponse | null>(null);

  const submitStudentConfirmation = useCallback(async (
    paymentBookingId: number | string,
    payload: { confirmation: boolean; description_student: string; evidence_file: File | Blob }
  ) => {
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const res = await api.postStudentConfirmation(paymentBookingId, payload);
      if (res.success && res.data) setSubmitResult(res.data);
      else setSubmitError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al enviar confirmación (alumno)';
      setSubmitError(message);
      return { success: false, message };
    } finally {
      setSubmitLoading(false);
    }
  }, [api]);

  const resetSubmit = useCallback(() => {
    setSubmitError(null);
    setSubmitResult(null);
  }, []);

  // recent
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<ConfirmationHistoryItem[]>([]);

  const loadStudentRecent = useCallback(async () => {
    setRecentLoading(true);
    setRecentError(null);
    try {
      const res = await api.getStudentHistoryRecent();
      if (res.success && res.data) setRecentItems(res.data.items || []);
      else setRecentError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al cargar recientes (alumno)';
      setRecentError(message);
      return { success: false, message };
    } finally {
      setRecentLoading(false);
    }
  }, [api]);

  // all
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<ConfirmationHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const loadStudentAll = useCallback(async (ofs: number = 0, lim: number = 10) => {
    setAllLoading(true);
    setAllError(null);
    try {
      const res = await api.getStudentHistoryAll(ofs, lim);
      if (res.success && res.data) {
        setAllItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setHasMore(!!res.data.has_more);
        setOffset(res.data.offset || ofs);
        setLimit(res.data.limit || lim);
      } else {
        setAllError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al cargar historial (alumno)';
      setAllError(message);
      return { success: false, message };
    } finally {
      setAllLoading(false);
    }
  }, [api]);

  // by-date
  const [dateLoading, setDateLoading] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [dateItems, setDateItems] = useState<ConfirmationHistoryItem[]>([]);

  const loadStudentByDate = useCallback(async (dateStr: string) => {
    setDateLoading(true);
    setDateError(null);
    try {
      const res = await api.getStudentHistoryByDate(dateStr);
      if (res.success && res.data) setDateItems(res.data.items || []);
      else setDateError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al buscar por fecha (alumno)';
      setDateError(message);
      return { success: false, message };
    } finally {
      setDateLoading(false);
    }
  }, [api]);

  // evidence helper (creates object URL)
  const getStudentEvidenceUrl = useCallback(async (confirmationId: number) => {
    const res = await api.getStudentEvidence(confirmationId);
    if (res.success && res.blob) {
      const url = URL.createObjectURL(res.blob);
      return { success: true, url, message: 'OK' };
    }
    return { success: false, message: res.message };
  }, [api]);

  const value = useMemo(() => ({
    submitLoading,
    submitError,
    submitResult,
    submitStudentConfirmation,
    recentLoading,
    recentError,
    recentItems,
    loadStudentRecent,
    allLoading,
    allError,
    allItems,
    total,
    hasMore,
    offset,
    limit,
    loadStudentAll,
    dateLoading,
    dateError,
    dateItems,
    loadStudentByDate,
    getStudentEvidenceUrl,
    resetSubmit,
  }), [
    submitLoading, submitError, submitResult, submitStudentConfirmation,
    recentLoading, recentError, recentItems, loadStudentRecent,
    allLoading, allError, allItems, total, hasMore, offset, limit, loadStudentAll,
    dateLoading, dateError, dateItems, loadStudentByDate,
    getStudentEvidenceUrl, resetSubmit,
  ]);

  return (
    <StudentConfirmationsContext.Provider value={value}>
      {children}
    </StudentConfirmationsContext.Provider>
  );
};

export const useStudentConfirmationsContext = () => {
  const ctx = useContext(StudentConfirmationsContext);
  if (!ctx) throw new Error('useStudentConfirmationsContext debe usarse dentro de StudentConfirmationsProvider');
  return ctx;
};

// Hook opcional: no lanza error si no existe el Provider
export const useOptionalStudentConfirmationsContext = () => {
  return useContext(StudentConfirmationsContext);
};
