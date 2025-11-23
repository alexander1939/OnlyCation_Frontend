export interface AssessmentsContextType {
  error: string | null;
  myRating: number | null;
  getMyRating: () => Promise<void>;
}

// Comentario público de un docente
export interface PublicAssessmentComment {
  id: number;
  comment: string;
  qualification: number;
  student_id: number;
  student_name: string;
  created_at: string;
}

// Contexto para comentarios públicos
export interface PublicAssessmentsContextType {
  loading: boolean;
  error: string | null;
  commentsByTeacherId: Record<number, PublicAssessmentComment[]>;
  fetchPublicComments: (teacherId: number, options?: { force?: boolean }) => Promise<{ success: boolean; message: string; data?: PublicAssessmentComment[] }>;
  resetStatus: () => void;
}
