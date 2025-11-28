import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useConfirmationsApi } from '../../hooks/confirmations/useConfirmationsApi';
import type {
  TeacherConfirmationPostResponse,
  TeacherHistoryRecentResponse,
  TeacherHistoryAllResponse,
  ConfirmationHistoryItem,
  TeacherHistoryByDateResponse,
} from './types';

export interface TeacherConfirmationsContextType {
  // submit
  submitLoading: boolean;
  submitError: string | null;
  submitResult: TeacherConfirmationPostResponse | null;
  submitTeacherConfirmation: (
    paymentBookingId: number | string,
    payload: { confirmation: boolean; description_teacher: string; evidence_file: File | Blob }
  ) => Promise<{ success: boolean; data?: TeacherConfirmationPostResponse; message: string }>;

  // recent
  recentLoading: boolean;
  recentError: string | null;
  recentItems: ConfirmationHistoryItem[];
  loadTeacherRecent: () => Promise<{ success: boolean; data?: TeacherHistoryRecentResponse; message: string }>;

  // all
  allLoading: boolean;
  allError: string | null;
  allItems: ConfirmationHistoryItem[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
  loadTeacherAll: (
    offset?: number,
    limit?: number
  ) => Promise<{ success: boolean; data?: TeacherHistoryAllResponse; message: string }>;

  // by-date
  dateLoading: boolean;
  dateError: string | null;
  dateItems: ConfirmationHistoryItem[];
  loadTeacherByDate: (dateStr: string) => Promise<{ success: boolean; data?: TeacherHistoryByDateResponse; message: string }>;

  // evidence convenience
  getTeacherEvidenceUrl: (confirmationId: number) => Promise<{ success: boolean; url?: string; message: string }>;

  resetSubmit: () => void;
}

const TeacherConfirmationsContext = createContext<TeacherConfirmationsContextType | undefined>(undefined);

export const TeacherConfirmationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useConfirmationsApi();

  // submit
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<TeacherConfirmationPostResponse | null>(null);

  const submitTeacherConfirmation = useCallback(async (
    paymentBookingId: number | string,
    payload: { confirmation: boolean; description_teacher: string; evidence_file: File | Blob }
  ) => {
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const res = await api.postTeacherConfirmation(paymentBookingId, payload);
      if (res.success && res.data) setSubmitResult(res.data);
      else setSubmitError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al enviar confirmación (docente)';
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

  const loadTeacherRecent = useCallback(async () => {
    setRecentLoading(true);
    setRecentError(null);
    try {
      const res = await api.getTeacherHistoryRecent();
      if (res.success && res.data) setRecentItems(res.data.items || []);
      else setRecentError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al cargar recientes (docente)';
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

  const loadTeacherAll = useCallback(async (ofs: number = 0, lim: number = 10) => {
    setAllLoading(true);
    setAllError(null);
    try {
      const res = await api.getTeacherHistoryAll(ofs, lim);
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
      const message = e?.message || 'Error al cargar historial (docente)';
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

  const loadTeacherByDate = useCallback(async (dateStr: string) => {
    setDateLoading(true);
    setDateError(null);
    try {
      const res = await api.getTeacherHistoryByDate(dateStr);
      if (res.success && res.data) setDateItems(res.data.items || []);
      else setDateError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al buscar por fecha (docente)';
      setDateError(message);
      return { success: false, message };
    } finally {
      setDateLoading(false);
    }
  }, [api]);

  // evidence helper (creates object URL)
  const getTeacherEvidenceUrl = useCallback(async (confirmationId: number) => {
    const res = await api.getTeacherEvidence(confirmationId);
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
    submitTeacherConfirmation,
    recentLoading,
    recentError,
    recentItems,
    loadTeacherRecent,
    allLoading,
    allError,
    allItems,
    total,
    hasMore,
    offset,
    limit,
    loadTeacherAll,
    dateLoading,
    dateError,
    dateItems,
    loadTeacherByDate,
    getTeacherEvidenceUrl,
    resetSubmit,
  }), [
    submitLoading, submitError, submitResult, submitTeacherConfirmation,
    recentLoading, recentError, recentItems, loadTeacherRecent,
    allLoading, allError, allItems, total, hasMore, offset, limit, loadTeacherAll,
    dateLoading, dateError, dateItems, loadTeacherByDate,
    getTeacherEvidenceUrl, resetSubmit,
  ]);

  return (
    <TeacherConfirmationsContext.Provider value={value}>
      {children}
    </TeacherConfirmationsContext.Provider>
  );
};

export const useTeacherConfirmationsContext = () => {
  const ctx = useContext(TeacherConfirmationsContext);
  if (!ctx) throw new Error('useTeacherConfirmationsContext debe usarse dentro de TeacherConfirmationsProvider');
  return ctx;
};

// Hook opcional: no lanza error si no existe el Provider
export const useOptionalTeacherConfirmationsContext = () => {
  return useContext(TeacherConfirmationsContext);
};
