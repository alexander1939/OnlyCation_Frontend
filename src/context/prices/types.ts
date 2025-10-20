export interface PriceCreateRequest {
  preference_id: number;
  price_range_id: number;
  selected_prices: number[]; // IDs de precios seleccionados
  extra_hour_price: number;
}

export interface PriceMeta {
  id: number;
  preference_id: number;
  price_range_id: number;
  selected_prices: number[];
  extra_hour_price: number;
  created_at: string;
}

export interface PricesContextType {
  creating: boolean;
  error: string | null;
  lastCreated: PriceMeta | null;
  createPrice: (payload: PriceCreateRequest) => Promise<void>;
  resetStatus: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
