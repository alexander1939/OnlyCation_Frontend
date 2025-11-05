import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { VideoSaveRequest, VideoSaveResponse } from './types';
import { useVideosApi } from '../../hooks/videos/useVideosApi';

export interface VideosContextType {
  saving: boolean;
  error: string | null;
  success: boolean;
  myVideoUrl: { embed_url: string; original_url: string } | null;
  saveMyVideo: (
    payload: VideoSaveRequest
  ) => Promise<{ success: boolean; data?: VideoSaveResponse; message: string }>;
  getMyVideoUrl: () => Promise<void>;
  resetStatus: () => void;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export const VideosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { saveMyVideo: apiSave, getMyVideoUrl: apiGetMyVideoUrl } = useVideosApi();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [myVideoUrl, setMyVideoUrl] = useState<{ embed_url: string; original_url: string } | null>(null);

  const saveMyVideo = useCallback(async (payload: VideoSaveRequest) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await apiSave(payload);
      setSuccess(res.success);
      if (!res.success) setError(res.message);
      return res;
    } catch (e: any) {
      const message = e?.message || 'Error al guardar el video';
      setError(message);
      return { success: false, message } as { success: boolean; message: string };
    } finally {
      setSaving(false);
    }
  }, [apiSave]);

  const getMyVideoUrl = useCallback(async () => {
    try {
      const res = await apiGetMyVideoUrl();
      if (res?.success && res.data) {
        setMyVideoUrl(res.data);
      } else {
        setError(res?.message || 'No se pudo obtener el video');
      }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido';
      setError(message);
    }
  }, [apiGetMyVideoUrl]);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const value = useMemo(() => ({ saving, error, success, myVideoUrl, saveMyVideo, getMyVideoUrl, resetStatus }), [saving, error, success, myVideoUrl, saveMyVideo, getMyVideoUrl, resetStatus]);

  return (
    <VideosContext.Provider value={value}>
      {children}
    </VideosContext.Provider>
  );
};

export const useVideosContext = (): VideosContextType => {
  const ctx = useContext(VideosContext);
  if (!ctx) throw new Error('useVideosContext must be used within a VideosProvider');
  return ctx;
};
