import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { WeeklyAgendaData, WeeklyAgendaResponse, DeleteAvailabilityPayload, DeleteAvailabilityResponse } from './types';
import { useAgendaApi } from '../../hooks/availability/useavailabilityApi';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';

export interface WeeklyAgendaContextType {
  loading: boolean;
  error: string | null;
  agendaData: WeeklyAgendaData | null;
  deleting: boolean;
  deleteError: string | null;
  deleteSuccess: string | null;
  currentWeekStart: Date;
  fetchWeeklyAgenda: (startDate?: Date) => Promise<{ success: boolean; data?: any; message: string }>;
  deleteAvailability: (availabilityId: number) => Promise<{ success: boolean; data?: any; message: string }>;
  resetStatus: () => void;
}

const WeeklyAgendaContext = createContext<WeeklyAgendaContextType | undefined>(undefined);

export const WeeklyAgendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchWeeklyAgenda: fetchWeeklyAgendaApi, deleteAvailability: deleteAvailabilityApi } = useAgendaApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agendaData, setAgendaData] = useState<WeeklyAgendaData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchWeeklyAgenda = useCallback(async (startDate?: Date) => {
    setLoading(true);
    setError(null);
    try {
      const weekStart = startDate || currentWeekStart;
      const weekEnd = addDays(weekStart, 6); 
      
      const startStr = format(weekStart, 'yyyy-MM-dd');
      const endStr = format(weekEnd, 'yyyy-MM-dd');
      
      console.log(`📅 Consultando agenda: ${startStr} a ${endStr}`);
      
      const res = await fetchWeeklyAgendaApi(startStr, endStr);
      if (res.success && res.data) {
        setAgendaData(res.data);
        setCurrentWeekStart(weekStart);
      } else {
        setError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener la agenda semanal';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setLoading(false);
    }
  }, [fetchWeeklyAgendaApi, currentWeekStart]);

  const deleteAvailability = useCallback(async (availabilityId: number) => {
    setDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const res = await deleteAvailabilityApi(availabilityId);
      if (res.success) {
        setDeleteSuccess(res.message);
        // Refrescar agenda después de eliminar
        await fetchWeeklyAgenda();
      } else {
        setDeleteError(res.message);
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al eliminar disponibilidad';
      setDeleteError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setDeleting(false);
    }
  }, [deleteAvailabilityApi, fetchWeeklyAgenda]);

  const resetStatus = useCallback(() => {
    setError(null);
    setAgendaData(null);
    setDeleteError(null);
    setDeleteSuccess(null);
  }, []);

  const value = useMemo(
    () => ({ 
      loading, 
      error, 
      agendaData, 
      deleting, 
      deleteError, 
      deleteSuccess,
      currentWeekStart,
      fetchWeeklyAgenda, 
      deleteAvailability, 
      resetStatus 
    }),
    [loading, error, agendaData, deleting, deleteError, deleteSuccess, currentWeekStart, fetchWeeklyAgenda, deleteAvailability, resetStatus]
  );

  return (
    <WeeklyAgendaContext.Provider value={value}>
      {children}
    </WeeklyAgendaContext.Provider>
  );
};

export const useWeeklyAgendaContext = (): WeeklyAgendaContextType => {
  const ctx = useContext(WeeklyAgendaContext);
  if (!ctx) throw new Error('useWeeklyAgendaContext must be used within a WeeklyAgendaProvider');
  return ctx;
};
