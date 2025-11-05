export interface BookingRequest {
  [key: string]: any;
}

export interface BookingPaymentData {
  [key: string]: any;
}

export interface BookingPaymentResponse {
  success: boolean;
  message: string;
  data: BookingPaymentData;
}

export interface UseBookingState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  datetime_start: string;
  datetime_end: string;
  status: string;
  availability_id: number;
  duration_hours: number;
}

export interface DayAgenda {
  date: string;
  day_name: string;
  slots: TimeSlot[];
}

export interface WeeklyAgendaData {
  teacher_id: number;
  teacher_name: string;
  week_start: string;
  week_end: string;
  days: DayAgenda[];
}

export interface WeeklyAgendaResponse {
  success: boolean;
  message: string;
  data: WeeklyAgendaData;
}

export interface DeleteAvailabilityPayload {
  preference_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface DeleteAvailabilityResponse {
  success: boolean;
  message: string;
}

export interface PublicDayAgenda {
  date: string;
  day_name: string;
  slots: TimeSlot[];
  total_slots: number;
  available_slots: number;
  occupied_slots: number;
}

export interface PublicAgendaSummary {
  total_days: number;
  days_with_availability: number;
  total_slots: number;
  available_slots: number;
  occupied_slots: number;
}

export interface PublicAgendaData {
  teacher_id: number;
  teacher_name: string;
  week_start: string;
  week_end: string;
  days: PublicDayAgenda[];
  summary: PublicAgendaSummary;
}

export interface PublicAgendaResponse {
  success: boolean;
  message: string;
  data: PublicAgendaData;
}
