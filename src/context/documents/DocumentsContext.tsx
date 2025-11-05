import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useDocumentsApi, type DocumentData, type UpdateDocumentPayload } from '../../hooks/documents/useDocumentsApi';
import type { DocumentsContextType, DocumentCreateForm, DocumentMeta } from './types';

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    createDocument: apiCreate, 
    readDocuments: apiRead, 
    updateDocument: apiUpdate, 
    downloadDocument: apiDownload, 
    getDocumentUrl,
    updateCertificate: apiUpdateCertificate,
    updateCurriculum: apiUpdateCurriculum,
    updateRfc: apiUpdateRfc,
    updateDescription: apiUpdateDescription,
    updateExpertiseArea: apiUpdateExpertiseArea,
    getMyDescription: apiGetMyDescription,
    getMyExpertiseArea: apiGetMyExpertiseArea
  } = useDocumentsApi();
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<DocumentMeta | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [myDescription, setMyDescription] = useState<string>('');
  const [myExpertiseArea, setMyExpertiseArea] = useState<string>('');

  const createDocument = useCallback(async (form: Required<Omit<DocumentCreateForm, 'certificate' | 'curriculum'>> & { certificate: File; curriculum: File; }) => {
    setCreating(true);
    setError(null);
    setLastCreated(null);
    try {
      const res = await apiCreate({
        rfc: form.rfc,
        expertise_area: form.expertise_area,
        description: form.description,
        certificate: form.certificate,
        curriculum: form.curriculum,
      });
      if (res?.success && res.data) {
        setLastCreated(res.data as DocumentMeta);
      } else {
        setError(res?.message || 'No se pudo crear el documento');
      }
    } catch (e: any) {
      setError(e?.message || 'Error desconocido');
    } finally {
      setCreating(false);
    }
  }, [apiCreate]);

  const readDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRead();
      if (res?.success && res.data) {
        setDocuments(res.data);
      } else {
        setError(res?.message || 'No se pudieron obtener los documentos');
      }
    } catch (e: any) {
      setError(e?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [apiRead]);

  const updateDocument = useCallback(async (documentId: number, payload: UpdateDocumentPayload) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdate(documentId, payload);
      if (res?.success && res.data) {
        // Actualizar el documento en la lista
        setDocuments(prev => prev.map(doc => doc.id === documentId ? res.data! : doc));
        return { success: true, message: res.message };
      } else {
        setError(res?.message || 'No se pudo actualizar el documento');
        return { success: false, message: res?.message || 'Error al actualizar' };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdate]);

  const downloadDocument = useCallback(async (documentId: number, kind: 'certificate' | 'curriculum') => {
    try {
      const result = await apiDownload(documentId, kind);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    }
  }, [apiDownload]);

  const resetStatus = useCallback(() => {
    setError(null);
    setLastCreated(null);
  }, []);

  const updateCertificate = useCallback(async (documentId: number, certificate: File) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdateCertificate(documentId, certificate);
      if (res?.success) {
        return { success: true, message: res.message };
      } else {
        setError(res?.message || 'No se pudo actualizar el certificado');
        return { success: false, message: res?.message || 'Error al actualizar' };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdateCertificate]);

  const updateCurriculum = useCallback(async (documentId: number, curriculum: File) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdateCurriculum(documentId, curriculum);
      if (res?.success) {
        return { success: true, message: res.message };
      } else {
        setError(res?.message || 'No se pudo actualizar el currículum');
        return { success: false, message: res?.message || 'Error al actualizar' };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdateCurriculum]);

  const updateRfc = useCallback(async (documentId: number, rfc: string) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdateRfc(documentId, rfc);
      if (res?.success) {
        return { success: true, message: res.message };
      } else {
        setError(res?.message || 'No se pudo actualizar el RFC');
        return { success: false, message: res?.message || 'Error al actualizar' };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdateRfc]);

  const updateDescription = useCallback(async (documentId: number, description: string) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdateDescription(documentId, description);
      if (res?.success) {
        return { success: true, message: res.message };
      } else {
        setError(res?.message || 'No se pudo actualizar la descripción');
        return { success: false, message: res?.message || 'Error al actualizar' };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdateDescription]);

  const updateExpertiseArea = useCallback(async (documentId: number, expertiseArea: string) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await apiUpdateExpertiseArea(documentId, expertiseArea);
      if (res?.success) {
        return { success: true, message: res.message };
      } else {
        setError(res?.message || 'No se pudo actualizar el área de especialización');
        return { success: false, message: res?.message || 'Error al actualizar' };
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, [apiUpdateExpertiseArea]);

  const getMyDescription = useCallback(async () => {
    try {
      const res = await apiGetMyDescription();
      if (res?.success && res.data) {
        setMyDescription(res.data.description);
      } else {
        setError(res?.message || 'No se pudo obtener la descripción');
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
    }
  }, [apiGetMyDescription]);

  const getMyExpertiseArea = useCallback(async () => {
    try {
      const res = await apiGetMyExpertiseArea();
      if (res?.success && res.data) {
        setMyExpertiseArea(res.data.expertise_area);
      } else {
        setError(res?.message || 'No se pudo obtener el área de especialización');
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
    }
  }, [apiGetMyExpertiseArea]);

  const value = useMemo(
    () => ({ 
      creating, 
      loading, 
      updating, 
      error, 
      lastCreated, 
      documents, 
      createDocument, 
      readDocuments, 
      updateDocument, 
      downloadDocument,
      resetStatus,
      updateCertificate,
      updateCurriculum,
      updateRfc,
      updateDescription,
      updateExpertiseArea,
      getMyDescription,
      getMyExpertiseArea,
      myDescription,
      myExpertiseArea
    }), 
    [creating, loading, updating, error, lastCreated, documents, createDocument, readDocuments, updateDocument, downloadDocument, resetStatus, updateCertificate, updateCurriculum, updateRfc, updateDescription, updateExpertiseArea, getMyDescription, getMyExpertiseArea, myDescription, myExpertiseArea]
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocumentsContext = (): DocumentsContextType => {
  const ctx = useContext(DocumentsContext);
  if (!ctx) throw new Error('useDocumentsContext must be used within a DocumentsProvider');
  return ctx;
};
