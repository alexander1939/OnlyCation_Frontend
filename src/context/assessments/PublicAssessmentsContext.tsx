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

  const fetchPublicComments = useCallback(async (teacherId: number, options?: { force?: boolean }) => {
    // Cache guard
    if (!options?.force && commentsByTeacherId[teacherId]) {
      setError(null);
      return { success: true, message: 'cached', data: commentsByTeacherId[teacherId] } as any;
    }

    // In-flight guard
    if (inFlightRef.current.has(teacherId)) {
      return { success: true, message: 'in_flight', data: commentsByTeacherId[teacherId] } as any;
    }

    inFlightRef.current.add(teacherId);
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicComments(teacherId);
      if (res.success && res.data) {
        setCommentsByTeacherId(prev => ({ ...prev, [teacherId]: res.data! }));
      } else {
        setError(res.message);
      }
      return res as any;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener comentarios públicos';
      setError(message);
      return { success: false, message } as any;
    } finally {
      inFlightRef.current.delete(teacherId);
      setLoading(false);
    }
  }, [getPublicComments, commentsByTeacherId]);

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
