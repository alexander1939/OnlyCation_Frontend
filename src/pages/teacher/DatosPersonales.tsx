import { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import { useUpdateProfile } from '../../hooks/auth/useUpdateProfile';
import { useVideosApi } from '../../hooks/videos/useVideosApi';
import { useAuthToken } from '../../hooks/auth/useAuthToken';
import type { VideoData } from '../../context/videos/types';
import '../../styles/docente-datos.css';
import LoadingOverlay from '../../components/shared/LoadingOverlay';

// Evita peticiones duplicadas (StrictMode monta/desmonta dos veces en dev):
// compartimos la misma promesa entre montajes para que solo haya 1 request real.
let myVideoInfoPromise: Promise<{ original: string; embed: string } | null> | null = null;
const SS_KEY_VIDEO_INFO = 'oc_my_video_info';

export default function DocenteDatosPersonales() {
  const { user, setUser } = useAuthContext();
  const { updateUserName, loading, error } = useUpdateProfile();
  const { updateMyVideo } = useVideosApi();
  const navigate = useNavigate();
  const { getAccessToken } = useAuthToken();

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';
  const [firstName, setFirstName] = useState<string>(user?.first_name ?? '');
  const [lastName, setLastName] = useState<string>(user?.last_name ?? '');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [currentVideoEmbedUrl, setCurrentVideoEmbedUrl] = useState<string>('');
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [showCurrentPreview, setShowCurrentPreview] = useState(false);
  const [showNewPreview, setShowNewPreview] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  const [newVideoTitle, setNewVideoTitle] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoSuccessMessage, setVideoSuccessMessage] = useState<string | null>(null);
  const [userVideos, setUserVideos] = useState<VideoData[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const overlayOpen = Boolean(loading || loadingVideos || savingVideo);

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    try {
      // Si la URL no tiene protocolo, agregamos https:// para que el constructor URL no falle
      let safeUrl = url.trim();
      if (!/^https?:\/\//i.test(safeUrl)) {
        safeUrl = `https://${safeUrl}`;
      }

      const u = new URL(safeUrl);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1);
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return v;
        const parts = u.pathname.split('/').filter(Boolean);
        const embedIdx = parts.indexOf('embed');
        if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
        const shortsIdx = parts.indexOf('shorts');
        if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
      }
    } catch { }
    return null;
  };

  const currentId = extractYouTubeId(currentVideoUrl) ?? '';
  const newId = newVideoUrl ? extractYouTubeId(newVideoUrl) ?? '' : '';
  const currentThumb = currentId ? `https://img.youtube.com/vi/${currentId}/sddefault.jpg` : '';
  const newThumb = newId ? `https://img.youtube.com/vi/${newId}/sddefault.jpg` : '';
  const currentEmbed = currentId ? `https://www.youtube.com/embed/${currentId}` : '';
  const newEmbed = newId ? `https://www.youtube.com/embed/${newId}` : '';
  const currentEmbedFinal = currentVideoEmbedUrl || currentEmbed;

  const fetchYouTubeTitle = async (watchUrl: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`);
      if (!res.ok) return null;
      const j = await res.json();
      return typeof j?.title === 'string' ? j.title : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setCurrentVideoTitle('');
  }, [currentId]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!newId) { setNewVideoTitle(''); return; }
      const url = `https://www.youtube.com/watch?v=${newId}`;
      const t = await fetchYouTubeTitle(url);
      if (!cancelled) setNewVideoTitle(t ?? '');
    };
    run();
    return () => { cancelled = true; };
  }, [newId]);

  // Cargar el video una sola vez y compartir la promesa entre montajes
  useEffect(() => {
    let active = true;
    setLoadingVideos(true);
    setVideoError(null);
    const token = getAccessToken();
    const endpoint = `/api/videos/my-video-url/`;

    // 1) Cache en sessionStorage para evitar llamadas repetidas
    try {
      const cachedRaw = sessionStorage.getItem(SS_KEY_VIDEO_INFO);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw) as { original?: string; embed?: string };
        if (cached && (cached.original || cached.embed)) {
          setCurrentVideoUrl(cached.original || '');
          setCurrentVideoEmbedUrl(cached.embed || '');
          setLoadingVideos(false);
          return () => { active = false; };
        }
      }
    } catch { }

    if (!myVideoInfoPromise) {
      myVideoInfoPromise = (async () => {
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          // No usamos credentials para evitar duplicar con cookies; backend acepta Bearer
        });
        if (!res.ok) throw new Error('No se pudo obtener el video');
        const j = await res.json();
        const original = j?.data?.original_url || '';
        const embed = j?.data?.embed_url || '';
        if (!original && !embed) return null;
        try { sessionStorage.setItem(SS_KEY_VIDEO_INFO, JSON.stringify({ original, embed })); } catch { }
        return { original, embed };
      })();
    }

    myVideoInfoPromise
      .then((info) => {
        if (!active) return;
        if (info) {
          setCurrentVideoUrl(info.original || '');
          setCurrentVideoEmbedUrl(info.embed || '');
        } else {
          setVideoError('No hay video configurado');
        }
      })
      .catch((e: any) => {
        if (!active) return;
        setVideoError(e?.message || 'Error al obtener el video');
      })
      .finally(() => {
        if (!active) return;
        setLoadingVideos(false);
      });

    return () => { active = false; };
  }, []);

  const handlePersonalDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setValidationError(null);

    // Validar que al menos un campo haya cambiado
    if (firstName === user?.first_name && lastName === user?.last_name) {
      setValidationError('No se detectaron cambios en los datos.');
      return;
    }

    // Validar que ambos campos estén presentes
    if (!firstName.trim() || !lastName.trim()) {
      setValidationError('Debes proporcionar tanto el nombre como el apellido.');
      return;
    }

    // Validar longitud máxima
    if (firstName.length > 50 || lastName.length > 50) {
      setValidationError('El nombre y apellido no pueden exceder los 50 caracteres.');
      return;
    }

    // Validar caracteres permitidos (letras, espacios y caracteres especiales comunes)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setValidationError('El nombre y apellido solo pueden contener letras y espacios.');
      return;
    }

    // Validar que no haya más de 2 letras consecutivas repetidas
    const repeatedCharsRegex = /(.)\1{2,}/;
    if (repeatedCharsRegex.test(firstName) || repeatedCharsRegex.test(lastName)) {
      setValidationError('El nombre y apellido no pueden tener más de 2 letras consecutivas iguales.');
      return;
    }

    // Validar que no haya secuencias largas de consonantes (más de 4 seguidas)
    // Esto ayuda a detectar "keyboard smashing" como "ananfaklnlaknklfa"
    const excessiveConsonantsRegex = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
    if (excessiveConsonantsRegex.test(firstName) || excessiveConsonantsRegex.test(lastName)) {
      setValidationError('El nombre y apellido contienen secuencias de letras no válidas.');
      return;
    }

    // Preparar datos para actualizar
    const updateData: { first_name?: string; last_name?: string } = {};
    if (firstName.trim() !== user?.first_name) {
      updateData.first_name = firstName.trim();
    }
    if (lastName.trim() !== user?.last_name) {
      updateData.last_name = lastName.trim();
    }

    // Llamar a la API
    const response = await updateUserName(updateData);

    if (response.success && response.data) {
      // Actualizar el contexto con los nuevos datos
      setUser({
        ...user!,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      });

      setSuccessMessage('¡Datos actualizados correctamente!');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/teacher-home');
      }, 2000);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId) {
      setVideoError('Por favor, ingresa una URL válida de YouTube');
      return;
    }

    setSavingVideo(true);
    setVideoError(null);
    setVideoSuccessMessage(null);

    // Update video using API (PUT /videos/my)
    const response = await updateMyVideo({ url_or_id: newVideoUrl });

    if (response.success && response.data?.data) {
      // Update current video
      setCurrentVideoUrl(response.data.data.original_url);
      setCurrentVideoEmbedUrl(response.data.data.embed_url || '');
      setCurrentVideoTitle(response.data.data.title);
      setShowNewPreview(false);
      setNewVideoUrl('');

      // Actualiza cache para evitar próxima carga duplicada
      try {
        sessionStorage.setItem(SS_KEY_VIDEO_INFO, JSON.stringify({
          original: response.data.data.original_url,
          embed: response.data.data.embed_url || ''
        }));
      } catch { }

      // Show success message
      setVideoError(null);
      setVideoSuccessMessage('¡Video actualizado exitosamente!');

      // Clear success message after 3 segundos
      setTimeout(() => {
        setVideoSuccessMessage(null);
      }, 3000);
    } else {
      setVideoError(response.message || 'Error al actualizar el video');
    }

    setSavingVideo(false);
  };

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="content-center-xl">
          <div className="datos-page-header">
            <h1 className="datos-page-title">Gestión de Datos y Video</h1>
            <Link to="/forgot-password" className="btn-pill">🔐 Restablecer Contraseña</Link>
          </div>

          <div className="datos-card">
            <h2 className="datos-section-title">Información Personal</h2>

            {/* Mensajes de éxito y error */}
            {successMessage && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '4px',
                border: '1px solid #c3e6cb'
              }}>
                {successMessage}
              </div>
            )}
            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}
            {validationError && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#fff3cd',
                color: '#856404',
                borderRadius: '4px',
                border: '1px solid #ffeeba'
              }}>
                {validationError}
              </div>
            )}

            <form onSubmit={handlePersonalDataSubmit}>
              <div className="form-grid">
                <label className="datos-field">
                  <span className="datos-label">Nombre</span>
                  <input
                    className="datos-input"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setFirstName(value);
                      }
                    }}
                    disabled={loading}
                    maxLength={50}
                  />
                </label>
                <label className="datos-field">
                  <span className="datos-label">Apellido</span>
                  <input
                    className="datos-input"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setLastName(value);
                      }
                    }}
                    disabled={loading}
                    maxLength={50}
                  />
                </label>
              </div>
              <div className="datos-actions-row">
                <button type="submit" className="btn-green-outline" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Datos'}
                </button>
              </div>
            </form>

            <div className="note-warning" style={{ marginTop: 12 }}>
              <span>⚠️</span>
              <span>Nota Importante: Si modificas tu nombre o apellido, deberás actualizar tu video de presentación para que la información sea consistente.</span>
            </div>

            <h2 className="datos-section-title" style={{ marginTop: 18 }}>Mi Video de Presentación</h2>

            {loadingVideos && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Cargando videos...
              </div>
            )}

            <div className="datos-video-grid">
              <div className="datos-video-card">
                <div className="datos-video-title">Video Actual</div>
                {(currentId || currentVideoEmbedUrl) ? (
                  <div className="datos-video-frame">
                    {(!showCurrentPreview && currentThumb) ? (
                      <button type="button" className="datos-video-thumb" style={{ backgroundImage: `url(${currentThumb})` }} onClick={() => setShowCurrentPreview(true)}>
                        ▶
                      </button>
                    ) : (
                      <div className="datos-embed-wrap">
                        <iframe src={`${currentEmbedFinal}?autoplay=1`} title="Video actual" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="datos-video-placeholder">Sin video actual</div>
                )}
                <div className="video-caption">"{currentVideoTitle || `Mi Presentación Profesional - ${fullName}`}"</div>
              </div>

              <div className="datos-video-card">
                <div className="datos-video-title">Nuevo Video Propuesto</div>
                {newId ? (
                  <div className="datos-video-frame">
                    {!showNewPreview ? (
                      <button type="button" className="datos-video-thumb" style={{ backgroundImage: `url(${newThumb})` }} onClick={() => setShowNewPreview(true)}>
                        ▶
                      </button>
                    ) : (
                      <div className="datos-embed-wrap">
                        <iframe src={`${newEmbed}?autoplay=1`} title="Nuevo video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="datos-video-placeholder">Pega una URL válida para previsualizar</div>
                )}
                <div className="video-caption">"{newVideoTitle || 'Nuevo Video Propuesto'}"</div>
              </div>
            </div>

            <h3 className="datos-section-title" style={{ marginTop: 12 }}>Actualizar Video</h3>
            <p className="datos-help">Para actualizar tu video de presentación, pega la URL de un video de YouTube en el siguiente campo.</p>

            {/* Video success message */}
            {videoSuccessMessage && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '4px',
                border: '1px solid #c3e6cb'
              }}>
                {videoSuccessMessage}
              </div>
            )}

            {/* Video error message */}
            {videoError && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                border: '1px solid #f5c6cb'
              }}>
                {videoError}
              </div>
            )}

            <form className="video-update-row" onSubmit={handleVideoSubmit}>
              <input
                className="datos-input datos-input--soft"
                placeholder="https://youtu.be/… o https://www.youtube.com/watch?v=…"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                disabled={savingVideo}
              />
              <button type="submit" className="btn-green-outline" disabled={savingVideo || !newId}>
                {savingVideo ? 'Actualizando...' : 'Actualizar Video'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <LoadingOverlay
        open={overlayOpen}
        message="Preparando tu experiencia..."
        logoSrc="/logo.png"
        gifSrc="/icons8-rhombus-loader-96.gif"
      />
    </div>
  );
}
