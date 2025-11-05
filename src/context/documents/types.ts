export interface DocumentCreateForm {
  rfc: string;
  expertise_area: string;
  description: string;
  certificate?: File | null;
  curriculum?: File | null;
}

export interface DocumentMeta {
  id: number;
  user_id: number;
  rfc: string;
  certificate: string;
  curriculum: string;
  description: string;
  expertise_area: string;
  created_at: string;
}

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

export interface DocumentsContextType {
  creating: boolean;
  loading: boolean;
  updating: boolean;
  error: string | null;
  lastCreated: DocumentMeta | null;
  documents: DocumentData[];
  myDescription: string;
  createDocument: (form: Required<Omit<DocumentCreateForm, 'certificate' | 'curriculum'>> & { certificate: File; curriculum: File; }) => Promise<void>;
  readDocuments: () => Promise<void>;
  updateDocument: (documentId: number, payload: UpdateDocumentPayload) => Promise<{ success: boolean; message: string }>;
  downloadDocument: (documentId: number, kind: 'certificate' | 'curriculum') => Promise<{ success: boolean; message: string }>;
  updateCertificate: (documentId: number, certificate: File) => Promise<{ success: boolean; message: string }>;
  updateCurriculum: (documentId: number, curriculum: File) => Promise<{ success: boolean; message: string }>;
  updateRfc: (documentId: number, rfc: string) => Promise<{ success: boolean; message: string }>;
  updateDescription: (documentId: number, description: string) => Promise<{ success: boolean; message: string }>;
  updateExpertiseArea: (documentId: number, expertiseArea: string) => Promise<{ success: boolean; message: string }>;
  getMyDescription: () => Promise<void>;
  resetStatus: () => void;
}

// API-facing types (comparten contrato con el backend)
export interface CreateDocumentPayload {
  rfc: string;
  expertise_area: string;
  description: string;
  certificate: File;
  curriculum: File;
}

export interface DocumentCreateResponseData {
  id: number;
  user_id: number;
  rfc: string; // cifrado en backend
  certificate: string; // url de descarga
  curriculum: string;  // url de descarga
  description: string;
  expertise_area: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
