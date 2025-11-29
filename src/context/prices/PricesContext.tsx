import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PricesContextType, PriceCreateRequest, PriceMeta, PriceUpdateRequest } from './types';
import { usePricesApi } from '../../hooks/prices/usePricesApi';

const PricesContext = createContext<PricesContextType | undefined>(undefined);

export const PricesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createPrice: apiCreate, getMyPrice: apiGetMyPrice, updatePrice: apiUpdatePrice } = usePricesApi();
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<PriceMeta | null>(null);
  const [myPrice, setMyPrice] = useState<number | null>(null);

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

  const getMyPrice = useCallback(async () => {
    try {
      const res = await apiGetMyPrice();
      if (res?.success && res.data) {
        setMyPrice(res.data.price);
      } else {
        setError(res?.message || 'No se pudo obtener el precio');
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
    }
  }, [apiGetMyPrice]);

  const updatePrice = useCallback(async (payload: PriceUpdateRequest) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdatePrice(payload);
      if (res?.success && res.data) {
        // Actualizar precio actual desde la respuesta
        setMyPrice(res.data.selected_prices);
        return { success: true, message: res.message || 'Precio actualizado exitosamente' };
      } else {
        const message = res?.message || 'No se pudo actualizar el precio';
        setError(message);
        return { success: false, message };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdatePrice]);

  const resetStatus = useCallback(() => {
    setError(null);
    setLastCreated(null);
  }, []);

  const value = useMemo(() => ({ creating, updating, error, lastCreated, myPrice, createPrice, getMyPrice, updatePrice, resetStatus }), [creating, updating, error, lastCreated, myPrice, createPrice, getMyPrice, updatePrice, resetStatus]);

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
