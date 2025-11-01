import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PricesContextType, PriceCreateRequest, PriceMeta } from './types';
import { usePricesApi } from '../../hooks/prices/usePricesApi';

const PricesContext = createContext<PricesContextType | undefined>(undefined);

export const PricesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createPrice: apiCreate } = usePricesApi();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<PriceMeta | null>(null);

  const createPrice = useCallback(async (payload: PriceCreateRequest) => {
    setCreating(true);
    setError(null);
    setLastCreated(null);
    try {
      const res = await apiCreate(payload);
      if (res?.success && res.data) {
        setLastCreated(res.data as PriceMeta);
      } else {
        setError(res?.message || 'No se pudo crear el precio');
      }
    } catch (e: any) {
      setError(e?.message || 'Error desconocido');
    } finally {
      setCreating(false);
    }
  }, [apiCreate]);

  const resetStatus = useCallback(() => {
    setError(null);
    setLastCreated(null);
  }, []);

  const value = useMemo(() => ({ creating, error, lastCreated, createPrice, resetStatus }), [creating, error, lastCreated, createPrice, resetStatus]);

  return (
    <PricesContext.Provider value={value}>
      {children}
    </PricesContext.Provider>
  );
};

export const usePricesContext = (): PricesContextType => {
  const ctx = useContext(PricesContext);
  if (!ctx) throw new Error('usePricesContext must be used within a PricesProvider');
  return ctx;
};
