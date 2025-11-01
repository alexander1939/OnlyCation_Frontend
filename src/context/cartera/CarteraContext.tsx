import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { WalletCreateRequest, WalletCreateResponse } from './types';
import { useAgendaApi } from '../../hooks/profile/useCarteraApi';

export interface AgendaContextType {
  creating: boolean;
  error: string | null;
  success: boolean;
  lastResponse?: WalletCreateResponse;
  createWallet: (payload: WalletCreateRequest) => Promise<{ success: boolean; data?: WalletCreateResponse; message: string }>;
  resetStatus: () => void;
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export const AgendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createWallet: apiCreate } = useAgendaApi();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastResponse, setLastResponse] = useState<WalletCreateResponse | undefined>(undefined);

  const createWallet = useCallback(async (payload: WalletCreateRequest) => {
    setCreating(true);
    setError(null);
    setSuccess(false);
    setLastResponse(undefined);
    try {
      const res = await apiCreate(payload);
      setSuccess(res.success);
      if (!res.success) setError(res.message);
      if (res.data) setLastResponse(res.data);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al crear cartera';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setCreating(false);
    }
  }, [apiCreate]);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLastResponse(undefined);
  }, []);

  const value = useMemo(() => ({ creating, error, success, lastResponse, createWallet, resetStatus }), [creating, error, success, lastResponse, createWallet, resetStatus]);

  return (
    <AgendaContext.Provider value={value}>
      {children}
    </AgendaContext.Provider>
  );
};

export const useAgendaContext = (): AgendaContextType => {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error('useAgendaContext must be used within an AgendaProvider');
  return ctx;
};
