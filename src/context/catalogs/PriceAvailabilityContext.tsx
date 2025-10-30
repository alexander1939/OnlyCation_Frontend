import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePriceAvailabilityApi, type PriceAvailabilityData, type PriceRangeItem } from '../../hooks/catalogs/usePriceAvailabilityApi';
import { useAuthToken } from '../../hooks/auth/useAuthToken';

interface PriceAvailabilityContextType {
  data: PriceAvailabilityData | null;
  priceRanges: PriceRangeItem[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const PriceAvailabilityContext = createContext<PriceAvailabilityContextType | undefined>(undefined);

export const PriceAvailabilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getPriceAvailability } = usePriceAvailabilityApi();
  const { getAccessToken } = useAuthToken();

  const [data, setData] = useState<PriceAvailabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const res = await getPriceAvailability(token);
      setData(res);
      if (res?.preference_id) {
        localStorage.setItem('preference_id', String(res.preference_id));
      }
    } catch (e: any) {
      setError(e?.message || 'Error al cargar disponibilidad de precios');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, getPriceAvailability]);

  // Run only once on mount to avoid dependency-induced loops
  useEffect(() => { void fetchAvailability(); }, []);

  const value = useMemo(
    () => ({ data, priceRanges: data?.price_ranges || [], loading, error, reload: fetchAvailability }),
    [data, loading, error, fetchAvailability]
  );

  return (
    <PriceAvailabilityContext.Provider value={value}>
      {children}
    </PriceAvailabilityContext.Provider>
  );
};

export const usePriceAvailabilityContext = (): PriceAvailabilityContextType => {
  const ctx = useContext(PriceAvailabilityContext);
  if (!ctx) throw new Error('usePriceAvailabilityContext must be used within a PriceAvailabilityProvider');
  return ctx;
};
