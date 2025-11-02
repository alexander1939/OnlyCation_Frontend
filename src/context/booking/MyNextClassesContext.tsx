import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NextClass, MyNextClassesResponse } from './types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export interface MyNextClassesContextType {
  loading: boolean;
  error: string | null;
  classes: NextClass[];
  fetchMyNextClasses: () => Promise<{ success: boolean; data?: MyNextClassesResponse; message: string }>;
  resetStatus: () => void;
}

const MyNextClassesContext = createContext<MyNextClassesContextType | undefined>(undefined);

export const MyNextClassesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getMyNextClasses } = useBookingApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<NextClass[]>([]);

  const fetchMyNextClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      const res = await getMyNextClasses();
      
      // Asegurar que el loading se muestre al menos 500ms
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      if (res.success && res.data?.data) {
        setClasses(res.data.data);
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
  }, [getMyNextClasses]);

  const resetStatus = useCallback(() => {
    setError(null);
    setClasses([]);
  }, []);

  const value = useMemo(
    () => ({ loading, error, classes, fetchMyNextClasses, resetStatus }),
    [loading, error, classes, fetchMyNextClasses, resetStatus]
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
