import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useActivationApi, type ActivationCheckData } from '../../hooks/profile/useActivationApi';

interface ActivationContextType {
  loading: boolean;
  error: string | null;
  data: ActivationCheckData | null;
  check: () => Promise<ActivationCheckData>;
  activate: () => Promise<ActivationCheckData>;
  getNextRoute: (fallback?: string) => string;
}

const ActivationContext = createContext<ActivationContextType | undefined>(undefined);

export const ActivationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkActivation, activateTeacher } = useActivationApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ActivationCheckData | null>(null);

  const check = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await checkActivation();
      setData(res);
      return res;
    } catch (e: any) {
      const msg = e?.message || 'Error al consultar activación';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [checkActivation]);

  const activate = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await activateTeacher();
      setData(res);
      return res;
    } catch (e: any) {
      const msg = e?.message || 'Error al activar la cuenta';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [activateTeacher]);

  const getNextRoute = useCallback(() => {
    const d = data || {} as ActivationCheckData & { missing?: string[] };
    if ((d as any).is_active) return '/profile/cartera';
    // Normalize flags using backend keys with fallbacks
    const hasPref = (d as any).has_preference ?? (d as any).has_preferences ?? false;
    const hasDocs = (d as any).has_documents ?? false;
    const hasPrice = (d as any).has_price ?? false;
    const hasVideo = (d as any).has_video ?? false;
    const hasAvail = (d as any).has_availability ?? (d as any).has_agenda ?? false;
    const hasWallet = (d as any).has_wallet ?? false;

    // If backend provides missing list and it's empty, treat as complete
    if (Array.isArray((d as any).missing) && (d as any).missing.length === 0) {
      return '/profile/cartera';
    }

    if (!hasPref) return '/profile/preferences';
    if (!hasDocs) return '/profile/documentos';
    if (!hasPrice) return '/profile/price';
    if (!hasVideo) return '/profile/video';
    if (!hasAvail) return '/profile/agenda';
    if (!hasWallet) return '/profile/cartera';
    return '/profile/cartera';
  }, [data]);

  const value = useMemo(() => ({ loading, error, data, check, activate, getNextRoute }), [loading, error, data, check, activate, getNextRoute]);

  return (
    <ActivationContext.Provider value={value}>
      {children}
    </ActivationContext.Provider>
  );
};

export const useActivation = (): ActivationContextType => {
  const ctx = useContext(ActivationContext);
  if (!ctx) throw new Error('useActivation must be used within an ActivationProvider');
  return ctx;
};
