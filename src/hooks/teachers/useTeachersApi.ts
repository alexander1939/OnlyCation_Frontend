import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { saveTeachersToCache, getTeachersFromCache } from '../../utils/teachersCache';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface SearchTeachersParams {
  name?: string;
  subject?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  page?: number;
  page_size?: number;
}

export interface Teacher {
  // Campos de /public/teachers/
  teacher_id?: number;
  subject?: string;
  price_per_class?: number;
  
  // Campos de /public/search-teachers/
  user_id?: number;
  expertise_area?: string;
  price_per_hour?: number;
  average_rating?: number;
  video_embed_url?: string;
  video_thumbnail_url?: string;
  
  // Campos comunes
  first_name: string;
  last_name: string;
  educational_level?: string;
  description?: string;
  total_bookings?: number;
}

export interface SearchTeachersResponse {
  success: boolean;
  message: string;
  data: Teacher[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Normaliza distintas formas de respuesta del backend a SearchTeachersResponse
const normalizeTeachersResponse = (
  raw: any,
  fallbackPage = 1,
  fallbackPageSize = 12
): SearchTeachersResponse => {
  let data: Teacher[] = [];
  let total = 0;
  let page = fallbackPage;
  let page_size = fallbackPageSize;
  let total_pages = 1;

  if (raw && Array.isArray(raw.data)) {
    // Forma { data: Teacher[], total?, page?, page_size?, total_pages? }
    data = raw.data as Teacher[];
    total = typeof raw.total === 'number' ? raw.total : data.length;
    page = typeof raw.page === 'number' ? raw.page : page;
    page_size = typeof raw.page_size === 'number' ? raw.page_size : page_size;
    total_pages = typeof raw.total_pages === 'number' ? raw.total_pages : Math.max(1, Math.ceil(total / page_size));
  } else if (raw && Array.isArray(raw.results)) {
    // Forma { results: Teacher[], count?, page?, page_size? }
    data = raw.results as Teacher[];
    total = typeof raw.count === 'number' ? raw.count : data.length;
    page = typeof raw.page === 'number' ? raw.page : page;
    page_size = typeof raw.page_size === 'number' ? raw.page_size : page_size;
    total_pages = Math.max(1, Math.ceil(total / page_size));
  } else if (Array.isArray(raw)) {
    // Forma simple: Teacher[]
    data = raw as Teacher[];
    total = data.length;
    total_pages = Math.max(1, Math.ceil(total / page_size));
  } else if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
    // Forma { items: Teacher[], total? }
    data = raw.items as Teacher[];
    total = typeof raw.total === 'number' ? raw.total : data.length;
    total_pages = Math.max(1, Math.ceil(total / page_size));
  } else {
    // Desconocido: retornar vacío pero success=true para no bloquear UI
    data = [];
    total = 0;
    total_pages = 0;
  }

  return {
    success: true,
    message: 'ok',
    data,
    total,
    page,
    page_size,
    total_pages,
  };
};

export const useTeachersApi = () => {
  // Usar axios global para aprovechar interceptores globales (apiErrorHandler)
  const client = useMemo(() => axios, []);

  const getTeachers = async (page: number = 1, pageSize: number = 12): Promise<SearchTeachersResponse> => {
    try {
      const url = `/public/teachers/?page=${page}&page_size=${pageSize}`;
      const res = await client.get<SearchTeachersResponse>(url, {
        baseURL: API_URL,
        headers: { 'Content-Type': 'application/json' },
      });
      const normalized = normalizeTeachersResponse(res.data, page, pageSize);
      if (normalized.data && normalized.data.length > 0) {
        saveTeachersToCache(normalized.data);
      }
      return normalized;
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al obtener profesores';
      
      // Intentar cargar del caché cuando falla la API
      const cachedTeachers = getTeachersFromCache();
      if (cachedTeachers && cachedTeachers.length > 0 && page === 1) {
        // Solo devolver caché en página 1
        // Limitar al pageSize solicitado (ej: 3 para Home, 12 para Catálogo)
        const limitedTeachers = cachedTeachers.slice(0, pageSize);
        
        return {
          success: true,
          message: 'Datos del caché',
          data: limitedTeachers,
          total: limitedTeachers.length,
          page: 1,
          page_size: limitedTeachers.length,
          total_pages: 1
        } as SearchTeachersResponse;
      }
      
      // Si es página > 1 o no hay caché, devolver vacío
      return {
        success: false,
        message,
        data: [],
        total: 0,
        page: page || 1,
        page_size: pageSize,
        total_pages: 0
      } as SearchTeachersResponse;
    }
  };

  const searchTeachers = async (params?: SearchTeachersParams): Promise<SearchTeachersResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.name) queryParams.append('name', params.name);
      if (params?.subject) queryParams.append('subject', params.subject);
      if (params?.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
      if (params?.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());
      if (params?.min_rating !== undefined) queryParams.append('min_rating', params.min_rating.toString());
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.page_size !== undefined) queryParams.append('page_size', params.page_size.toString());

      const queryString = queryParams.toString();
      const url = `/public/search-teachers/${queryString ? `?${queryString}` : ''}`;

      const res = await client.get<SearchTeachersResponse>(url, {
        baseURL: API_URL,
        headers: { 'Content-Type': 'application/json' },
      });
      const normalized = normalizeTeachersResponse(res.data, params?.page ?? 1, params?.page_size ?? 12);
      if (normalized.data && normalized.data.length > 0) {
        saveTeachersToCache(normalized.data);
      }
      return normalized;
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al buscar profesores';
      
      // Intentar cargar del caché cuando falla la API
      const cachedTeachers = getTeachersFromCache();
      if (cachedTeachers && cachedTeachers.length > 0) {
        return {
          success: true,
          message: 'Datos del caché',
          data: cachedTeachers,
          total: cachedTeachers.length,
          page: 1,
          page_size: cachedTeachers.length,
          total_pages: 1
        } as SearchTeachersResponse;
      }
      
      return {
        success: false,
        message,
        data: [],
        total: 0,
        page: 1,
        page_size: 12,
        total_pages: 0
      } as SearchTeachersResponse;
    }
  };

  return { getTeachers, searchTeachers };
};
