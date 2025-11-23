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

// Crear Booking (Stripe Checkout Session)
export interface BookingCreateItem {
  availability_id: number;
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
}

export interface BookingCreateRequest {
  availability_id: number; // slot de referencia (el primero cronológico)
  price_id: number;
  start_time: string; // ISO 8601 del slot de referencia
  end_time: string;   // ISO 8601 del slot de referencia
  total_hours: number; // suma de horas seleccionadas
  availability_ids?: number[]; // todos los availability_id seleccionados
  items?: BookingCreateItem[]; // detalle de cada slot seleccionado
}

export interface BookingCreateResponseData {
  url: string;
  session_id: string;
  price: number;
}

export interface BookingCreateResponse {
  success: boolean;
  message: string;
  data: BookingCreateResponseData;
}

// Verificar Booking (Stripe) y crear registros
export interface VerifyBookingResponseData {
  booking_id: number;
  payment_booking_id: number;
  confirmation_id: number;
}

export interface VerifyBookingResponse {
  success: boolean;
  message: string;
  payment_status: string; // e.g., 'completed'
  data: VerifyBookingResponseData;
}
