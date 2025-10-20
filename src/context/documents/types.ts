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

export interface DocumentsContextType {
  creating: boolean;
  error: string | null;
  lastCreated: DocumentMeta | null;
  createDocument: (form: Required<Omit<DocumentCreateForm, 'certificate' | 'curriculum'>> & { certificate: File; curriculum: File; }) => Promise<void>;
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
