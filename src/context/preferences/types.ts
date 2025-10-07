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
