import { useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';

export interface EducationalLevel { id: number; name: string }
export interface Modality { id: number; name: string }

const API_URL = import.meta.env.VITE_API_URL as string;

export const useCatalogsApi = () => {
  const client = useMemo(() => axios.create({ baseURL: API_URL }), []);

  const getEducationalLevels = useCallback(async (): Promise<EducationalLevel[]> => {
    try {
      const res = await client.get<EducationalLevel[]>('/educational-levels/');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      const axErr = err as AxiosError;
      throw new Error(axErr.response?.statusText || axErr.message || 'Error al obtener niveles educativos');
    }
  }, [client]);

  const getModalities = useCallback(async (): Promise<Modality[]> => {
    try {
      const res = await client.get<Modality[]>('/modalities/');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      const axErr = err as AxiosError;
      throw new Error(axErr.response?.statusText || axErr.message || 'Error al obtener modalidades');
    }
  }, [client]);

  return { getEducationalLevels, getModalities };
};
