import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PreferenceCreateRequest, PreferenceCreateResponse } from './types';
import { usePreferencesApi } from '../../hooks/preferences/usePreferencesApi';

export interface PreferencesContextType {
  creating: boolean;
  error: string | null;
  success: boolean;
  educationalLevel: string;
  createPreferences: (payload: PreferenceCreateRequest) => Promise<{ success: boolean; data?: PreferenceCreateResponse; message: string }>;
  getEducationalLevel: () => Promise<void>;
  resetStatus: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createPreferences: apiCreate, getEducationalLevel: apiGetEducationalLevel } = usePreferencesApi();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [educationalLevel, setEducationalLevel] = useState<string>('');

  const createPreferences = useCallback(async (payload: PreferenceCreateRequest) => {
    setCreating(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await apiCreate(payload);
      setSuccess(res.success);
      if (!res.success) setError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al crear preferencias';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setCreating(false);
    }
  }, [apiCreate]);

  const getEducationalLevel = useCallback(async () => {
    try {
      const res = await apiGetEducationalLevel();
      if (res?.success && res.data) {
        setEducationalLevel(res.data.educational_level);
      } else {
        setError(res?.message || 'No se pudo obtener el nivel educativo');
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
    }
  }, [apiGetEducationalLevel]);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const value = useMemo(() => ({ creating, error, success, educationalLevel, createPreferences, getEducationalLevel, resetStatus }), [creating, error, success, educationalLevel, createPreferences, getEducationalLevel, resetStatus]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferencesContext = (): PreferencesContextType => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferencesContext must be used within a PreferencesProvider');
  return ctx;
};
