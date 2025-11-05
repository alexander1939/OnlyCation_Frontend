import { useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';

export interface PriceRangeItem {
  id: number;
  name?: string;
  label?: string;
  // Backend keys
  minimum_price?: number;
  maximum_price?: number;
  // Back-compat keys
  min_price?: number;
  max_price?: number;
}

export interface PriceAvailabilityData {
  preference_id: number;
  educational_level_id: number;
  price_ranges: PriceRangeItem[];
}

export interface PriceAvailabilityResponse {
  success: boolean;
  message?: string;
  data?: PriceAvailabilityData;
}

const API_URL = import.meta.env.VITE_API_URL as string;

export const usePriceAvailabilityApi = () => {
  const client = useMemo(() => axios.create({ baseURL: API_URL }), []);

  const getPriceAvailability = useCallback(async (token: string): Promise<PriceAvailabilityData> => {
    try {
      const res = await client.get<PriceAvailabilityResponse>('/prices/availability/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.data) return res.data.data;
      if ((res.data as unknown as PriceAvailabilityData)?.preference_id) {
        return res.data as unknown as PriceAvailabilityData;
      }
      throw new Error(res.data?.message || 'No se pudo obtener la disponibilidad de precios');
    } catch (err) {
      const axErr = err as AxiosError;
      throw new Error(axErr.response?.statusText || axErr.message || 'Error al obtener disponibilidad de precios');
    }
  }, [client]);

  return { getPriceAvailability };
};
