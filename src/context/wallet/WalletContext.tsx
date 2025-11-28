import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { WalletBalanceData, WalletBalanceResponse, WalletContextType, WalletCreateRequest, WalletCreateResponse, WalletState } from './types';
import { useWalletApi } from '../../hooks/wallet/useWalletApi';

interface WalletContextValue extends WalletContextType {
  // Add any additional context values here
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const initialState: WalletState = {
  loading: false,
  error: null,
  success: false,
  balance: null,
  lastUpdated: null,
  creating: false,
  lastResponse: undefined,
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getWalletBalance, createWallet: apiCreate } = useWalletApi();
  const [state, setState] = useState<WalletState>(initialState);

  const fetchWalletBalance = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { success, data, message } = await getWalletBalance();
      
      if (success && data?.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          balance: data.data,
          lastUpdated: new Date(),
        }));
        
        // If account is pending and has setup URL, redirect to it
        if (data.data.account_status === 'pending' && data.data.stripe_setup_url) {
          window.location.href = data.data.stripe_setup_url;
          return;
        }
        
        // If account is active and has dashboard URL, redirect to it
        if (data.data.account_status === 'active' && data.data.stripe_dashboard_url) {
          window.location.href = data.data.stripe_dashboard_url;
          return;
        }
      } else {
        throw new Error(message || 'Error al obtener el balance de la cartera');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el balance';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));
    }
  }, [getWalletBalance]);

  const createWallet = useCallback(async (payload: WalletCreateRequest) => {
    setState(prev => ({ ...prev, creating: true, error: null, success: false, lastResponse: undefined }));
    try {
      const res = await apiCreate(payload);
      setState(prev => ({
        ...prev,
        creating: false,
        success: res.success,
        lastResponse: res.data,
      }));
      if (!res.success) {
        setState(prev => ({ ...prev, error: res.message }));
      }
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al crear cartera';
      setState(prev => ({
        ...prev,
        creating: false,
        error: message,
        success: false,
      }));
      return { success: false, message };
    }
  }, [apiCreate]);

  const resetStatus = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      success: false,
      creating: false,
      lastResponse: undefined,
    }));
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      ...state,
      createWallet,
      fetchWalletBalance,
      resetStatus,
    }),
    [state, createWallet, fetchWalletBalance, resetStatus]
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// For backward compatibility
export const useAgendaContext = useWallet;
export const AgendaProvider = WalletProvider;
export const AgendaContext = WalletContext;
