import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useStudentAssessmentsApi } from '../../hooks/assessments/useStudentAssessmentsApi';
import type { AssessmentCreate, StudentAssessmentsContextType } from './types';

const StudentAssessmentsContext = createContext<StudentAssessmentsContextType | undefined>(undefined);

export const StudentAssessmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useStudentAssessmentsApi();

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<AssessmentCreate | null>(null);

  const createAssessment = useCallback(async (
    paymentBookingId: number | string,
    payload: { qualification: number; comment: string }
  ): Promise<{ success: boolean; message: string; data?: AssessmentCreate }> => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await api.createAssessment(paymentBookingId, payload);
      if (res.success && res.data) setLastCreated(res.data);
      else setCreateError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al crear evaluación';
      setCreateError(message);
      return { success: false, message };
    } finally {
      setCreateLoading(false);
    }
  }, [api]);

  const resetCreate = useCallback(() => {
    setCreateError(null);
    setLastCreated(null);
  }, []);

  const value = useMemo<StudentAssessmentsContextType>(() => ({
    createLoading,
    createError,
    lastCreated,
    createAssessment,
    resetCreate,
  }), [createLoading, createError, lastCreated, createAssessment, resetCreate]);

  return (
    <StudentAssessmentsContext.Provider value={value}>
      {children}
    </StudentAssessmentsContext.Provider>
  );
};

export const useStudentAssessmentsContext = () => {
  const ctx = useContext(StudentAssessmentsContext);
  if (!ctx) throw new Error('useStudentAssessmentsContext debe usarse dentro de StudentAssessmentsProvider');
  return ctx;
};

export const useOptionalStudentAssessmentsContext = () => useContext(StudentAssessmentsContext);
