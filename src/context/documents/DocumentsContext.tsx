import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useDocumentsApi } from '../../hooks/documents/useDocumentsApi';
import type { DocumentsContextType, DocumentCreateForm, DocumentMeta } from './types';

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createDocument: apiCreate } = useDocumentsApi();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<DocumentMeta | null>(null);

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

  const resetStatus = useCallback(() => {
    setError(null);
    setLastCreated(null);
  }, []);

  const value = useMemo(() => ({ creating, error, lastCreated, createDocument, resetStatus }), [creating, error, lastCreated, createDocument, resetStatus]);

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
