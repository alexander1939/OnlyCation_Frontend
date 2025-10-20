// Types for preferences feature

export interface PreferenceCreateRequest {
  educational_level_id: number;
  modality_id: number;
  location: string;
  location_description: string;
}

export interface PreferenceCreateData {
  educational_level_id: number;
  modality_id: number;
  location: string;
  location_description: string;
  created_at: string;
}

export interface PreferenceCreateResponse {
  success: boolean;
  message: string;
  data: PreferenceCreateData;
}

// Datos completos de preferencias (GET/me)
export interface PreferenceData {
  educational_level_id: number;
  modality_id: number;
  location: string;
  location_description: string;
  created_at: string;
  updated_at: string;
}

export interface PreferenceResponse {
  success: boolean;
  message: string;
  data: PreferenceData;
}

// Update (PUT/update/me) - solo campos proporcionados
export interface PreferenceUpdateRequest {
  educational_level_id?: number;
  modality_id?: number;
  location?: string;
  location_description?: string;
}

export interface PreferenceUpdateData {
  educational_level_id: number;
  modality_id: number;
  location: string;
  location_description: string;
  updated_at: string;
}

export interface PreferenceUpdateResponse {
  success: boolean;
  message: string;
  data: PreferenceUpdateData;
}

// Estado común que utiliza el hook/context de preferencias
export interface UsePreferencesState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
