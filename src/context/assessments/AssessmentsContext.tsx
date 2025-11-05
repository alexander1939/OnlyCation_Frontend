import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AssessmentsContextType } from './types';
import { useAssessmentsApi } from '../../hooks/assessments/useAssessmentsApi';

const AssessmentsContext = createContext<AssessmentsContextType | undefined>(undefined);

export const AssessmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getMyRating: apiGetMyRating } = useAssessmentsApi();
  const [error, setError] = useState<string | null>(null);
  const [myRating, setMyRating] = useState<number | null>(null);

  const getMyRating = useCallback(async () => {
    try {
      const res = await apiGetMyRating();
      if (res?.success && res.data) {
        setMyRating(res.data.average_rating);
      } else {
        setError(res?.message || 'No se pudo obtener la calificación');
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
    }
  }, [apiGetMyRating]);

  const value = useMemo(() => ({ error, myRating, getMyRating }), [error, myRating, getMyRating]);

  return (
    <AssessmentsContext.Provider value={value}>
      {children}
    </AssessmentsContext.Provider>
  );
};

export const useAssessmentsContext = (): AssessmentsContextType => {
  const ctx = useContext(AssessmentsContext);
  if (!ctx) throw new Error('useAssessmentsContext must be used within an AssessmentsProvider');
  return ctx;
};
