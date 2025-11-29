export interface PriceCreateRequest {
  preference_id: number;
  price_range_id: number;
  selected_prices: number;
  extra_hour_price?: number;
}

export interface PriceMeta {
  id: number;
  preference_id: number;
  price_range_id: number;
  selected_prices: number;
  extra_hour_price?: number;
  created_at: string;
}

// Petición de actualización de precio
export interface PriceUpdateRequest {
  price_range_id: number;
  selected_prices: number;
}

// Respuesta/datos de actualización
export interface PriceUpdateData {
  id: number;
  preference_id: number;
  price_range_id: number;
  selected_prices: number;
  extra_hour_price: number;
  created_at: string;
  updated_at: string;
}

export interface PricesContextType {
  creating: boolean;
  updating: boolean;
  error: string | null;
  lastCreated: PriceMeta | null;
  myPrice: number | null;
  createPrice: (payload: PriceCreateRequest) => Promise<void>;
  getMyPrice: () => Promise<void>;
  updatePrice: (payload: PriceUpdateRequest) => Promise<{ success: boolean; message: string }>;
  resetStatus: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
