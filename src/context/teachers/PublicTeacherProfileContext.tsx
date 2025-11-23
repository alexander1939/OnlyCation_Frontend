import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PublicTeacherProfileContextType, PublicTeacherProfile } from './types';
import { usePublicTeacherProfileApi } from '../../hooks/teachers/usePublicTeacherProfileApi';

const PublicTeacherProfileContext = createContext<PublicTeacherProfileContextType | undefined>(undefined);

export const PublicTeacherProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getPublicTeacherProfile } = usePublicTeacherProfileApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilesByTeacherId, setProfilesByTeacherId] = useState<Record<number, PublicTeacherProfile>>({});
  const inFlightRef = useRef<Set<number>>(new Set());

  const fetchPublicTeacherProfile = useCallback(async (teacherId: number, options?: { force?: boolean }) => {
    // Cache guard
    if (!options?.force && profilesByTeacherId[teacherId]) {
      setError(null);
      return { success: true, message: 'cached', data: profilesByTeacherId[teacherId] } as any;
    }

    // In-flight guard
    if (inFlightRef.current.has(teacherId)) {
      return { success: true, message: 'in_flight', data: profilesByTeacherId[teacherId] } as any;
    }

    inFlightRef.current.add(teacherId);
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicTeacherProfile(teacherId);
      if (res.success && res.data) {
        setProfilesByTeacherId(prev => ({ ...prev, [teacherId]: res.data! }));
      } else {
        setError(res.message);
      }
      return res as any;
    } catch (e: any) {
      const message = e?.message || 'Error al obtener perfil público del docente';
      setError(message);
      return { success: false, message } as any;
    } finally {
      inFlightRef.current.delete(teacherId);
      setLoading(false);
    }
  }, [getPublicTeacherProfile, profilesByTeacherId]);

  const resetStatus = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    loading,
    error,
    profilesByTeacherId,
    fetchPublicTeacherProfile,
    resetStatus,
  }), [loading, error, profilesByTeacherId, fetchPublicTeacherProfile, resetStatus]);

  return (
    <PublicTeacherProfileContext.Provider value={value}>
      {children}
    </PublicTeacherProfileContext.Provider>
  );
};

export const usePublicTeacherProfileContext = (): PublicTeacherProfileContextType => {
  const ctx = useContext(PublicTeacherProfileContext);
  if (!ctx) throw new Error('usePublicTeacherProfileContext must be used within a PublicTeacherProfileProvider');
  return ctx;
};
