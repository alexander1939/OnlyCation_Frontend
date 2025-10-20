export interface VideoSaveRequest {
  url_or_id: string;
}

export interface VideoData {
  id: number;
  youtube_video_id: string;
  title: string;
  thumbnail_url: string;
  duration_seconds: number;
  embed_url: string;
  privacy_status: string;
  embeddable: boolean;
  original_url: string;
  created_at: string;
  updated_at: string;
}

export interface VideoSaveResponse {
  success: boolean;
  message: string;
  data: VideoData | null;
}
