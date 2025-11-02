import React, { useCallback, useMemo, useState } from 'react';
import { useActivationApi, type ActivationCheckData } from '../../hooks/activation/useActivationApi';
import { ActivationContext } from './context';

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
      return '/profile/wallet';
    }

    if (!hasPref) return '/profile/preferences';
    if (!hasDocs) return '/profile/document';
    if (!hasPrice) return '/profile/price';
    if (!hasVideo) return '/profile/video';
    if (!hasAvail) return '/profile/availability';
    if (!hasWallet) return '/profile/wallet';
    return '/profile/wallet';
  }, [data]);

  const value = useMemo(() => ({ loading, error, data, check, activate, getNextRoute }), [loading, error, data, check, activate, getNextRoute]);

  return (
    <ActivationContext.Provider value={value}>
      {children}
    </ActivationContext.Provider>
  );
};

