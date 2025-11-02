import { useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import '../../styles/docente-datos.css';

export default function DocenteDatosPersonales() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '—' : '—';
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('https://youtu.be/tdFNA7YBM4c');
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [showCurrentPreview, setShowCurrentPreview] = useState(false);
  const [showNewPreview, setShowNewPreview] = useState(false);

  const extractYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url);
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
    } catch {}
    return null;
  };

  const currentId = extractYouTubeId(currentVideoUrl) ?? '';
  const newId = newVideoUrl ? extractYouTubeId(newVideoUrl) ?? '' : '';
  const currentThumb = currentId ? `https://img.youtube.com/vi/${currentId}/sddefault.jpg` : '';
  const newThumb = newId ? `https://img.youtube.com/vi/${newId}/sddefault.jpg` : '';
  const currentEmbed = currentId ? `https://www.youtube.com/embed/${currentId}` : '';
  const newEmbed = newId ? `https://www.youtube.com/embed/${newId}` : '';

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="content-center-xl">
          <div className="datos-card" aria-labelledby="datos-title">
            <div className="datos-avatar">
              <div className="datos-initials">{initials}</div>
            </div>
            <h1 id="datos-title" className="datos-title">{fullName}</h1>
            <p className="datos-subtitle">Gestiona tu información personal y seguridad.</p>

            <form
              className="datos-form"
              onSubmit={(e)=>{
                e.preventDefault();
                if(newId){
                  setCurrentVideoUrl(newVideoUrl);
                  setShowNewPreview(false);
                }
              }}
            >
              <label className="datos-field">
                <span className="datos-label">Nombre</span>
                <input className="datos-input" placeholder="Nombre" defaultValue={user?.first_name ?? ''} />
              </label>
              <label className="datos-field">
                <span className="datos-label">Apellido</span>
                <input className="datos-input" placeholder="Apellido" defaultValue={user?.last_name ?? ''} />
              </label>

              <div className="datos-video-section">
                <div className="card-header card-header--gradient-mint">
                  <div>
                    <div className="card-title">Video de presentación</div>
                    <div className="card-subtitle">Pega una URL de YouTube. Puedes previsualizar antes de guardar.</div>
                  </div>
                </div>

                <label className="datos-field">
                  <span className="datos-label">URL de YouTube</span>
                  <input
                    className="datos-input"
                    placeholder="https://youtu.be/… o https://www.youtube.com/watch?v=…"
                    value={newVideoUrl}
                    onChange={(e)=>setNewVideoUrl(e.target.value)}
                  />
                </label>

                <div className="datos-video-grid">
                  <div className="datos-video-card">
                    <div className="datos-video-title">Actual</div>
                    {currentId ? (
                      <div className="datos-video-frame">
                        {!showCurrentPreview ? (
                          <button type="button" className="datos-video-thumb" style={{backgroundImage:`url(${currentThumb})`}} onClick={()=>setShowCurrentPreview(true)}>
                            ▶
                          </button>
                        ) : (
                          <div className="datos-embed-wrap">
                            <iframe src={`${currentEmbed}?autoplay=1`} title="Video actual" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="datos-video-placeholder">Sin video actual</div>
                    )}
                  </div>

                  <div className="datos-video-card">
                    <div className="datos-video-title">Nueva previsualización</div>
                    {newId ? (
                      <div className="datos-video-frame">
                        {!showNewPreview ? (
                          <button type="button" className="datos-video-thumb" style={{backgroundImage:`url(${newThumb})`}} onClick={()=>setShowNewPreview(true)}>
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
                  </div>
                </div>
              </div>

              <div className="datos-actions">
                <Link to="/auth/change-password" className="btn-green" role="button">Cambiar Contraseña</Link>
                <button type="submit" className="btn-green-outline">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
