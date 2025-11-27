// Types for Confirmations (Student & Teacher)

export type WindowStatus = 'open' | 'expired';

export interface ConfirmationHistoryItem {
  id: number;
  teacher_id: number;
  student_id: number;
  payment_booking_id: number;
  booking_start: string; // ISO 8601 (UTC)
  booking_end: string;   // ISO 8601 (UTC)
  confirmed_by_student: string | null; // ISO or null
  confirmed_by_teacher: string | null; // ISO or null
  window_status: WindowStatus;
  confirmable_now: boolean;
  seconds_left: number;
}

// Student POST /student/{payment_booking_id}
export interface StudentConfirmationPostData {
  id: number;
  teacher_id: number;
  student_id: number;
  payment_booking_id: number;
  confirmation_date_student: string; // ISO
  description_student: string;
}

export interface StudentConfirmationPostResponse {
  success: boolean;
  message: string;
  data: StudentConfirmationPostData;
}

// Teacher POST /teacher/{payment_booking_id}
export interface TeacherConfirmationPostData {
  id: number;
  teacher_id: number;
  student_id: number;
  payment_booking_id: number;
  confirmation_date_teacher: string; // ISO
  description_teacher: string;
  evidence_teacher?: string; // optional path
}

export interface TeacherConfirmationPostResponse {
  success: boolean;
  message: string;
  data: TeacherConfirmationPostData;
}

// Student history recent
export interface StudentHistoryRecentResponse {
  success: boolean;
  items: ConfirmationHistoryItem[];
}

// Student history all (paginated)
export interface StudentHistoryAllResponse {
  success: boolean;
  offset: number;
  limit: number;
  total: number;
  has_more: boolean;
  items: ConfirmationHistoryItem[];
}

// Teacher history recent
export interface TeacherHistoryRecentResponse {
  success: boolean;
  items: ConfirmationHistoryItem[];
}

// Teacher history all (paginated)
export interface TeacherHistoryAllResponse {
  success: boolean;
  offset: number;
  limit: number;
  total: number;
  has_more: boolean;
  items: ConfirmationHistoryItem[];
}
