import React, { useCallback, useMemo, useState } from 'react';
import { useActivationApi, type ActivationCheckData } from '../../hooks/activation/useActivationApi';
import { ActivationContext } from './context';

export const ActivationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkActivation, activateTeacher } = useActivationApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ActivationCheckData | null>(null);
  const inFlightRef = React.useRef<Promise<ActivationCheckData> | null>(null);

  // Initialize from session cache to avoid extra roundtrips across route changes
  React.useEffect(() => {
    try {
      const cached = sessionStorage.getItem('activation_check_cache');
      if (cached && !data) {
        const parsed = JSON.parse(cached) as ActivationCheckData;
        setData(parsed);
      }
    } catch { /* ignore cache errors */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = useCallback(async (force?: boolean) => {
    if (!force && data) return data; // return cached in-memory
    if (!force && inFlightRef.current) return inFlightRef.current; // de-duplicate concurrent
    setLoading(true); setError(null);
    const p = (async () => {
      try {
        const res = await checkActivation();
        setData(res);
        try { sessionStorage.setItem('activation_check_cache', JSON.stringify(res)); } catch {}
        return res;
      } catch (e: any) {
        const msg = e?.message || 'Error al consultar activación';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
        inFlightRef.current = null;
      }
    })();
    inFlightRef.current = p;
    return p;
  }, [checkActivation, data]);

  const activate = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await activateTeacher();
      setData(res);
      try { sessionStorage.setItem('activation_check_cache', JSON.stringify(res)); } catch {}
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
    const d = (data || {}) as ActivationCheckData & { missing?: string[] };

    // Central mapping and order
    const routeByStep: Record<string, string> = {
      preferences: '/profile/preferences',
      documents: '/profile/document',
      price: '/profile/price',
      video: '/profile/video',
      availability: '/profile/availability',
      wallet: '/profile/wallet',
      activate: '/profile/activate',
    };
    const order = ['preferences','documents','price','video','availability','wallet','activate'];

    // Normalize flags using backend keys with fallbacks
    const isActive = (d as any).is_active === true;
    const hasPref = (d as any).has_preference ?? (d as any).has_preferences ?? false;
    const hasDocs = (d as any).has_documents ?? false;
    const hasPrice = (d as any).has_price ?? false;
    const hasVideo = (d as any).has_video ?? false;
    const hasAvail = (d as any).has_availability ?? (d as any).has_agenda ?? false;
    const hasWallet = (d as any).has_wallet ?? false;

    // Normalize missing from backend
    const rawMissing = Array.isArray((d as any).missing) ? (d as any).missing as string[] : null;
    const normalize = (k: string) => {
      const v = String(k || '').toLowerCase();
      if (['preference','preferences'].includes(v)) return 'preferences';
      if (['document','documents','docs'].includes(v)) return 'documents';
      if (['price','prices'].includes(v)) return 'price';
      if (['video','videos'].includes(v)) return 'video';
      if (['availability','agenda','schedule'].includes(v)) return 'availability';
      if (['wallet','cartera','payouts'].includes(v)) return 'wallet';
      if (['activate','activation'].includes(v)) return 'activate';
      return v;
    };
    const missing = rawMissing ? rawMissing.map(normalize) : null;

    // If already active → home docente
    if (isActive) return '/teacher-home';

    // Build a merged set of pending steps: backend missing U flags(false)
    const flagsByStep: Record<string, boolean> = {
      preferences: !!hasPref,
      documents: !!hasDocs,
      price: !!hasPrice,
      video: !!hasVideo,
      availability: !!hasAvail,
      wallet: !!hasWallet,
    };
    const mergedMissing = new Set<string>(missing || []);
    order.forEach(step => {
      if (step !== 'activate' && flagsByStep[step] === false) mergedMissing.add(step);
    });

    // Prefer merged set to pick next
    const firstPending = order.find(k => k !== 'activate' && mergedMissing.has(k));
    if (firstPending) return routeByStep[firstPending];

    // All steps complete but not active → activate
    return routeByStep.activate;
  }, [data]);

  const value = useMemo(() => ({ loading, error, data, check, activate, getNextRoute }), [loading, error, data, check, activate, getNextRoute]);

  return (
    <ActivationContext.Provider value={value}>
      {children}
    </ActivationContext.Provider>
  );
};

