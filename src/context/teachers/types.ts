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
