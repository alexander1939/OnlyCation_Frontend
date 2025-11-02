import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { VideoSaveRequest, VideoSaveResponse } from './types';
import { useVideosApi } from '../../hooks/videos/useVideosApi';

export interface VideosContextType {
  saving: boolean;
  error: string | null;
  success: boolean;
  saveMyVideo: (
    payload: VideoSaveRequest
  ) => Promise<{ success: boolean; data?: VideoSaveResponse; message: string }>;
  resetStatus: () => void;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export const VideosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { saveMyVideo: apiSave } = useVideosApi();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const value = useMemo(() => ({ saving, error, success, saveMyVideo, resetStatus }), [saving, error, success, saveMyVideo, resetStatus]);

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
