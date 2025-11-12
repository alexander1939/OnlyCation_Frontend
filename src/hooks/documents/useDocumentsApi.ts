import { useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type { CreateDocumentPayload, ApiResponse, DocumentCreateResponseData } from '../../context/documents';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface DocumentData {
  id: number;
  user_id: number;
  rfc: string;
  description: string;
  certificate: string;
  curriculum: string;
  expertise_area: string;
  created_at: string;
}

export interface UpdateDocumentPayload {
  rfc?: string;
  expertise_area?: string;
  description?: string;
  certificate?: File;
  curriculum?: File;
}

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
      form.append('certificate', payload.certificate, payload.certificate.name);
      form.append('curriculum', payload.curriculum, payload.curriculum.name);

      const res = await client.post<ApiResponse<DocumentCreateResponseData>>(
        '/documents/create/',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      const axErr = err as AxiosError<any>;
      const data = axErr.response?.data as any;
      let message: string = 'Error al crear el documento';
      if (data?.detail) {
        if (typeof data.detail === 'string') {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((d: any) => {
              const loc = Array.isArray(d?.loc) ? d.loc.join('.') : d?.loc;
              const msg = d?.msg || d?.message || 'Error de validación';
              return loc ? `${loc}: ${msg}` : msg;
            })
            .join('; ');
        } else if (typeof data.detail === 'object') {
          const loc = Array.isArray((data.detail as any).loc) ? (data.detail as any).loc.join('.') : (data.detail as any).loc;
          const msg = (data.detail as any).msg || (data.detail as any).message || 'Error de validación';
          message = loc ? `${loc}: ${msg}` : msg;
        }
      } else if (typeof data?.message === 'string') {
        message = data.message;
      } else if (axErr.message) {
        message = axErr.message;
      }
      return { success: false, message } as ApiResponse<DocumentCreateResponseData>;
    }
  }, [client, getAccessToken]);

  const readDocuments = useCallback(async (): Promise<ApiResponse<DocumentData[]>> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get<{ success: boolean; message: string; data: DocumentData[] }>(
        '/documents/read/',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al obtener documentos';
      return { success: false, message } as ApiResponse<DocumentData[]>;
    }
  }, [client, getAccessToken]);

  const updateDocument = useCallback(async (documentId: number, payload: UpdateDocumentPayload): Promise<ApiResponse<DocumentData>> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      if (payload.rfc) form.append('rfc', payload.rfc);
      if (payload.expertise_area) form.append('expertise_area', payload.expertise_area);
      if (payload.description) form.append('description', payload.description);
      if (payload.certificate) form.append('certificate', payload.certificate);
      if (payload.curriculum) form.append('curriculum', payload.curriculum);

      const res = await client.put<{ success: boolean; message: string; data: DocumentData }>(
        `/documents/update/${documentId}/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al actualizar documento';
      return { success: false, message } as ApiResponse<DocumentData>;
    }
  }, [client, getAccessToken]);

  const downloadDocument = useCallback(async (documentId: number, kind: 'certificate' | 'curriculum'): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get(`/documents/${documentId}/download/${kind}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      // Crear URL del blob y descargarlo
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva pestaña
      window.open(url, '_blank');
      
      // Limpiar después de un tiempo
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      return { success: true, message: 'Documento descargado exitosamente' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al descargar documento';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const getDocumentUrl = useCallback((documentId: number, kind: 'certificate' | 'curriculum'): string => {
    return `${API_URL}/documents/${documentId}/download/${kind}`;
  }, []);

  const updateCertificate = useCallback(async (documentId: number, certificate: File): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('certificate', certificate);

      const res = await client.patch(`/documents/update-certificate/${documentId}/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: 'Certificado actualizado exitosamente' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al actualizar certificado';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const updateCurriculum = useCallback(async (documentId: number, curriculum: File): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('curriculum', curriculum);

      const res = await client.patch(`/documents/update-curriculum/${documentId}/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: 'Curriculum actualizado exitosamente' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al actualizar curriculum';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const updateRfc = useCallback(async (documentId: number, rfc: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('rfc', rfc);

      const res = await client.patch(`/documents/update-rfc/${documentId}/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: 'RFC actualizado exitosamente' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al actualizar RFC';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const updateDescription = useCallback(async (documentId: number, description: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('description', description);

      const res = await client.patch(`/documents/update-description/${documentId}/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: 'Descripción actualizada exitosamente' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al actualizar descripción';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const updateExpertiseArea = useCallback(async (documentId: number, expertiseArea: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('expertise_area', expertiseArea);

      const res = await client.patch(`/documents/update-expertise-area/${documentId}/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, message: 'Área de especialidad actualizada exitosamente' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al actualizar área de especialidad';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const getMyDescription = useCallback(async (): Promise<{ success: boolean; message: string; data?: { description: string } }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get<{ success: boolean; message: string; data: { description: string } }>('/documents/my-description/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { 
        success: true, 
        message: res.data.message || 'Descripción obtenida exitosamente',
        data: res.data.data 
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener descripción';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  const getMyExpertiseArea = useCallback(async (): Promise<{ success: boolean; message: string; data?: { expertise_area: string } }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const res = await client.get<{ success: boolean; message: string; data: { expertise_area: string } }>('/documents/my-expertise-area/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { 
        success: true, 
        message: res.data.message || 'Área de especialidad obtenida exitosamente',
        data: res.data.data 
      };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al obtener área de especialidad';
      return { success: false, message };
    }
  }, [client, getAccessToken]);

  return { 
    createDocument, 
    readDocuments, 
    updateDocument, 
    downloadDocument, 
    getDocumentUrl,
    updateCertificate,
    updateCurriculum,
    updateRfc,
    updateDescription,
    updateExpertiseArea,
    getMyDescription,
    getMyExpertiseArea
  };
};
