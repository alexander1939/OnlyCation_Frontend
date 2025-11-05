import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideosProvider, useVideosContext } from '../../context/videos';
import type { VideoSaveRequest, VideoData } from '../../context/videos/types';
import '../../styles/Video.css';
import OnboardingSteps from '../../components/OnboardingSteps';
import { useActivation } from '../../context/activation/useActivation';

const initialForm: VideoSaveRequest = { url_or_id: '' };

const VideoInner: React.FC = () => {
  const { saveMyVideo, saving, error, success, resetStatus } = useVideosContext();
  const [form, setForm] = useState<VideoSaveRequest>(initialForm);
  const [saved, setSaved] = useState<VideoData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const navigate = useNavigate();
  const { check } = useActivation();

  // Extrae el ID de YouTube desde una URL completa o devuelve el valor si ya parece un ID
  const extractYouTubeId = (value: string): string | null => {
    const v = value.trim();
    if (!v) return null;
    // youtu.be/<id>
    const short = v.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
    if (short) return short[1];
    // youtube.com/watch?v=<id>
    const watch = v.match(/[?&]v=([A-Za-z0-9_-]{6,})/i);
    if (watch) return watch[1];
    // youtube.com/embed/<id>
    const embed = v.match(/\/embed\/([A-Za-z0-9_-]{6,})/i);
    if (embed) return embed[1];
    // Si no es URL, asumir que podría ser ID
    if (/^[A-Za-z0-9_-]{6,}$/.test(v)) return v;
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error || success) resetStatus();
    // Actualiza vista previa
    const id = extractYouTubeId(value);
    setPreviewUrl(id ? `https://www.youtube.com/embed/${id}` : '');
  };

  const handleCancel = () => {
    setForm(initialForm);
    setSaved(null);
    resetStatus();
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveMyVideo(form);
    if (res.success && res.data?.data) setSaved(res.data.data);
  };

  React.useEffect(() => {
    if (success) {
      (async () => {
        try { await check(true); } catch {}
        navigate('/profile/availability');
      })();
    }
  }, [success, navigate, check]);

  return (
    <div className="video-page video-container">
      <div className="video-wrap">
        <OnboardingSteps />
        <div className="video-header">
          <h1 className="video-title video-title-lg">Video de Presentación</h1>
          <p className="video-subtitle video-text-sm" style={{ marginTop: '0.5rem' }}>
            Agrega tu video de YouTube para mostrarte en tu perfil.
          </p>
          <div style={{ position: 'fixed', left: '2rem', bottom: '1rem', pointerEvents: 'none' }}>
        <img src="/Activar_cuenta.png" alt="activar cuenta" style={{ width: '330px', height: 'auto' }} />
      </div>
    </div>

        <div className="video-card">
          <form onSubmit={handleSubmit} className="video-form">
            <div className="video-grid">
              <div className="video-col-2">
                <label htmlFor="url_or_id" className="video-label">Video de Presentación</label>
                <div className="video-field">
                  <span className="video-icon pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 8l6 4-6 4V8z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="url_or_id"
                    name="url_or_id"
                    value={form.url_or_id}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=... o ID"
                    className="video-input with-icon pr-3"
                    autoComplete="off"
                  />
                </div>
              </div>

              {(previewUrl || saved?.embed_url) && (
                <div className="video-col-2">
                  <div className="video-preview">
                    <iframe src={previewUrl || (saved?.embed_url as string)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen title="Video de presentación" />
                  </div>
                </div>
              )}
            </div>

            <div className="video-actions">
              <button type="button" onClick={handleCancel} className="video-btn--secondary">
                Cancelar
              </button>
              <button type="submit" disabled={saving || !form.url_or_id.trim()} className={`video-btn--primary ${saving ? 'cursor-not-allowed' : ''}`}>
                {saving ? 'Guardando...' : 'Guardar Video'}
              </button>
            </div>

            {error && <p className="video-alert video-alert--error">{error}</p>}
            {success && <p className="video-alert video-alert--success">¡Video guardado correctamente!</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

const VideoPage: React.FC = () => (
  <VideosProvider>
    <VideoInner />
  </VideosProvider>
);

export default VideoPage;
