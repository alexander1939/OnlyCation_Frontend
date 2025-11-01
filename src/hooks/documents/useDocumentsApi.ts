import { useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type { CreateDocumentPayload, ApiResponse, DocumentCreateResponseData } from '../../context/documents';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useDocumentsApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({ baseURL: API_URL });
  }, []);

  const createDocument = useCallback(async (payload: CreateDocumentPayload): Promise<ApiResponse<DocumentCreateResponseData>> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('rfc', payload.rfc);
      form.append('expertise_area', payload.expertise_area);
      form.append('description', payload.description);
      // MUST match FastAPI param names
      form.append('certificate', payload.certificate);
      form.append('curriculum', payload.curriculum);

      const res = await client.post<ApiResponse<DocumentCreateResponseData>>(
        '/documents/create/',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // No Content-Type for FormData
          },
        }
      );
      return res.data;
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al crear el documento';
      return { success: false, message } as ApiResponse<DocumentCreateResponseData>;
    }
  }, [client, getAccessToken]);

  return { createDocument };
};
