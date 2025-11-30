// src/hooks/auth/useTokenRefresh.ts
import { useCallback } from 'react';
import { useLoginContext } from '../../context/auth/LoginContext';
import { useRefreshTokenApi } from './useRefreshTokenApi';

export const useTokenRefresh = () => {
  const { setUser } = useLoginContext();
  const { refresh } = useRefreshTokenApi();

  const refreshIfMissingPreference = useCallback(async (): Promise<{ refreshed: boolean; error?: string }> => {
    try {
      const pref = (localStorage.getItem('user_preference_id') || '').trim();
      const refreshToken = (localStorage.getItem('refresh_token') || '').trim();

      // Si ya hay preference_id o no hay refresh_token, no hacer nada
      if (pref) return { refreshed: false };
      if (!refreshToken) return { refreshed: false };

      const res = await refresh(refreshToken);
      if (res.success && res.data) {
        const d = res.data;
        // Actualizar storage
        localStorage.setItem('access_token', d.access_token);
        localStorage.setItem('refresh_token', d.refresh_token || refreshToken);
        localStorage.setItem('user_email', d.email);
        localStorage.setItem('user_role', d.role);
        localStorage.setItem('user_first_name', d.first_name);
        localStorage.setItem('user_last_name', d.last_name);
        localStorage.setItem('user_status', d.status || '');
        localStorage.setItem('user_preference_id', (d.preference_id ?? '').toString());
        localStorage.setItem('user_id', String(d.user_id));

        // Actualizar contexto de usuario
        setUser({
          email: d.email,
          first_name: d.first_name,
          last_name: d.last_name,
          role: d.role,
          status: d.status,
          preference_id: d.preference_id ?? null,
          id: d.user_id,
        });
        return { refreshed: true };
      }
      return { refreshed: false, error: res.message };
    } catch (e: any) {
      return { refreshed: false, error: e?.message || 'Error al refrescar token' };
    }
  }, [refresh, setUser]);

  return { refreshIfMissingPreference };
};
