import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { PublicTeacherProfile } from '../../context/teachers/types';

const API_URL = import.meta.env.VITE_API_URL as string;

// --- Caché persistente por docente (localStorage) ---
const PROFILE_CACHE_PREFIX = 'public_profile_';
const getProfileCacheKey = (teacherId: number) => `${PROFILE_CACHE_PREFIX}${teacherId}`;

const saveProfileToCache = (teacherId: number, data: PublicTeacherProfile) => {
  try {
    const payload = { data, ts: Date.now() };
    localStorage.setItem(getProfileCacheKey(teacherId), JSON.stringify(payload));
  } catch {}
};

const getProfileFromCache = (teacherId: number): PublicTeacherProfile | null => {
  try {
    const raw = localStorage.getItem(getProfileCacheKey(teacherId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
};

export const usePublicTeacherProfileApi = () => {
  // Usar axios global para aprovechar interceptores globales
  const client = useMemo(() => axios, []);

  const getPublicTeacherProfile = async (
    teacherId: number
  ): Promise<{ success: boolean; message: string; data?: PublicTeacherProfile }> => {
    try {
      const res = await client.get(
        `/public/teachers/${teacherId}`,
        { baseURL: API_URL, headers: { 'Content-Type': 'application/json' } }
      );

      const raw: any = res.data;
      let data: PublicTeacherProfile | undefined;
      // Soportar dos formatos: objeto plano o envuelto en { success, data }
      if (raw && typeof raw === 'object') {
        if ('user_id' in raw) {
          data = raw as PublicTeacherProfile;
        } else if ('data' in raw) {
          data = raw.data as PublicTeacherProfile;
        }
      }

      if (data) {
        saveProfileToCache(teacherId, data);
      }

      return {
        success: !!data,
        message: raw?.message || 'Perfil público obtenido exitosamente',
        data,
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const status = axErr.response?.status;
      const message =
        axErr.response?.data?.detail ||
        axErr.response?.data?.message ||
        (status === 404 ? 'Perfil público no encontrado' : undefined) ||
        axErr.message ||
        'Error al obtener el perfil público del docente';

      // Fallback a caché local si existe
      const cached = getProfileFromCache(teacherId);
      if (cached) {
        return { success: true, message: 'Datos del caché', data: cached };
      }
      return { success: false, message };
    }
  };

  return { getPublicTeacherProfile };
};
