export interface NextClass {
  booking_id: number;
  availability_id: number;
  start_time: string;
  end_time: string;
  materia: string;
  modality: string;
  participant_role: 'teacher' | 'student';
  status: string;
  created_at?: string;
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  student?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  class_link?: string;
  confirmation_teacher?: boolean;
  confirmation_student?: boolean;
}

export interface MyNextClassesResponse {
  success: boolean;
  message: string;
  data: NextClass[];
  total: number;
  offset: number;
  limit: number;
  has_more: boolean;
}

export interface BookingDetailData {
  booking_id: number;
  created_at: string;
  start_time: string;
  end_time: string;
  modality: string;
  class_link: string;
  materia: string;
  status: string;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
  };
  confirmation_teacher: boolean;
  confirmation_student: boolean;
  total_paid: number;
}

export interface BookingDetailResponse {
  success: boolean;
  message: string;
  data: BookingDetailData;
}
