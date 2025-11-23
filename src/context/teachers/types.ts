import type { Teacher, SearchTeachersParams } from '../../hooks/teachers/useTeachersApi';

export interface TeachersContextType {
  teachers: Teacher[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  getTeachers: (page?: number, pageSize?: number) => Promise<void>;
  searchTeachers: (params?: SearchTeachersParams) => Promise<void>;
  clearResults: () => void;
}

// Perfil público consolidado del docente
export interface PublicTeacherProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  educational_level: string;
  expertise_area: string;
  description: string;
  price_per_hour: number;
  average_rating: number;
  video_embed_url: string;
  video_thumbnail_url: string;
}

// Contexto para perfil público
export interface PublicTeacherProfileContextType {
  loading: boolean;
  error: string | null;
  profilesByTeacherId: Record<number, PublicTeacherProfile>;
  fetchPublicTeacherProfile: (teacherId: number, options?: { force?: boolean }) => Promise<{ success: boolean; message: string; data?: PublicTeacherProfile }>;
  resetStatus: () => void;
}
