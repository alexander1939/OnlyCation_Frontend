import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import type { PublicAgendaResponse, PublicAgendaData } from '../../context/availability/types';

const API_URL = import.meta.env.VITE_API_URL as string;

// --- Caché persistente de agenda pública por docente/semana ---
const AGENDA_CACHE_PREFIX = 'public_agenda_';
const getAgendaKey = (teacherId: number, params?: { week?: string; start_date?: string; end_date?: string }) => {
  const w = params?.week ?? '';
  const s = params?.start_date ?? '';
  const e = params?.end_date ?? '';
  return `${AGENDA_CACHE_PREFIX}${teacherId}|${w}|${s}|${e}`;
};

const saveAgendaToCache = (teacherId: number, params: { week?: string; start_date?: string; end_date?: string } | undefined, data: PublicAgendaData) => {
  try {
    const key = getAgendaKey(teacherId, params);
    const payload = { data, ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {}
};

const getAgendaFromCache = (teacherId: number, params?: { week?: string; start_date?: string; end_date?: string }): PublicAgendaData | null => {
  try {
    const key = getAgendaKey(teacherId, params);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
};

export const usePublicAgendaApi = () => {
  // Usar axios global para aprovechar interceptores globales
  const client = useMemo(() => axios, []);

  type PublicAgendaQuery = { week?: string; start_date?: string; end_date?: string };

  const getPublicAgenda = async (
    teacherId: number,
    params?: PublicAgendaQuery
  ): Promise<{ 
    success: boolean; 
    data?: PublicAgendaResponse; 
    message: string 
  }> => {
    try {
      const response = await client.get<PublicAgendaResponse>(
        `/availability/docente/${teacherId}/agenda/`,
        { params, baseURL: API_URL, headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      // Guardar en caché si hay datos
      if (data?.data) {
        saveAgendaToCache(teacherId, params, data.data);
      }
      return {
        success: data?.success ?? true,
        data,
        message: data?.message ?? 'Agenda pública obtenida exitosamente',
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener la agenda pública';
      // Fallback a caché local si existe
      const cached = getAgendaFromCache(teacherId, params);
      if (cached) {
        return {
          success: true,
          data: { success: true, message: 'cached', data: cached },
          message: 'Datos del caché',
        } as const;
      }
      return { success: false, message };
    }
  };

  return { getPublicAgenda };
};
