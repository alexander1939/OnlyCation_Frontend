/* @refresh reload */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PublicAssessmentsContextType, PublicAssessmentComment } from './types';
import { usePublicAssessmentsApi } from '../../hooks/assessments/usePublicAssessmentsApi';

const PublicAssessmentsContext = createContext<PublicAssessmentsContextType | undefined>(undefined);

export const PublicAssessmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getPublicComments } = usePublicAssessmentsApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentsByTeacherId, setCommentsByTeacherId] = useState<Record<number, PublicAssessmentComment[]>>({});
  const inFlightRef = useRef<Set<number>>(new Set());
  // Cache interno estable para evitar depender del estado en la función y repetir peticiones
  const commentsCacheRef = useRef<Record<number, PublicAssessmentComment[]>>({});

  const fetchPublicComments = useCallback(async (teacherId: number, options?: { force?: boolean }) => {
    // Cache guard (usa ref estable)
    if (!options?.force && Object.prototype.hasOwnProperty.call(commentsCacheRef.current, teacherId)) {
      setError(null);
      return { success: true, message: 'cached', data: commentsCacheRef.current[teacherId] } as any;
    }

    // In-flight guard
    if (inFlightRef.current.has(teacherId)) {
      return { success: true, message: 'in_flight', data: commentsCacheRef.current[teacherId] } as any;
    }

    inFlightRef.current.add(teacherId);
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicComments(teacherId);
      const data = Array.isArray(res.data) ? res.data : [];
      if (res.success) {
        // Cachear siempre, aunque esté vacío
        commentsCacheRef.current[teacherId] = data;
        setCommentsByTeacherId(prev => ({ ...prev, [teacherId]: data }));
        setError(null);
      } else {
        setError(res.message);
      }
      return { success: !!res.success, message: res.message, data } as any;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener comentarios públicos';
      setError(message);
      return { success: false, message } as any;
    } finally {
      inFlightRef.current.delete(teacherId);
      setLoading(false);
    }
  }, [getPublicComments]);

  const resetStatus = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    loading,
    error,
    commentsByTeacherId,
    fetchPublicComments,
    resetStatus,
  }), [loading, error, commentsByTeacherId, fetchPublicComments, resetStatus]);

  return (
    <PublicAssessmentsContext.Provider value={value}>
      {children}
    </PublicAssessmentsContext.Provider>
  );
};

export const usePublicAssessmentsContext = (): PublicAssessmentsContextType => {
  const ctx = useContext(PublicAssessmentsContext);
  if (!ctx) throw new Error('usePublicAssessmentsContext must be used within a PublicAssessmentsProvider');
  return ctx;
};
