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
