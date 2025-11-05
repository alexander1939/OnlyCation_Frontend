import { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import '../../styles/docente-datos.css';

export default function DocenteDatosPersonales() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';
  const [firstName, setFirstName] = useState<string>(user?.first_name ?? '');
  const [lastName, setLastName] = useState<string>(user?.last_name ?? '');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('https://youtu.be/tdFNA7YBM4c');
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [showCurrentPreview, setShowCurrentPreview] = useState(false);
  const [showNewPreview, setShowNewPreview] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  const [newVideoTitle, setNewVideoTitle] = useState<string>('');

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
    let cancelled = false;
    const run = async () => {
      if (!currentId) { setCurrentVideoTitle(''); return; }
      const url = `https://www.youtube.com/watch?v=${currentId}`;
      const t = await fetchYouTubeTitle(url);
      if (!cancelled) setCurrentVideoTitle(t ?? '');
    };
    run();
    return () => { cancelled = true; };
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
            <form onSubmit={(e)=>{e.preventDefault(); setEditingPersonal(false);}}>
              <div className="form-grid">
                <label className="datos-field">
                  <span className="datos-label">Nombre</span>
                  <input className={`datos-input ${!editingPersonal ? 'datos-input--soft' : ''}`} placeholder="Nombre" value={firstName} onChange={(e)=>setFirstName(e.target.value)} readOnly={!editingPersonal} />
                </label>
                <label className="datos-field">
                  <span className="datos-label">Apellido</span>
                  <input className={`datos-input ${!editingPersonal ? 'datos-input--soft' : ''}`} placeholder="Apellido" value={lastName} onChange={(e)=>setLastName(e.target.value)} readOnly={!editingPersonal} />
                </label>
              </div>
              <div className="datos-actions-row">
                {!editingPersonal ? (
                  <button type="button" className="btn-green-outline" onClick={()=>setEditingPersonal(true)}>Editar Datos</button>
                ) : (
                  <button type="submit" className="btn-green-outline">Guardar Datos</button>
                )}
              </div>
            </form>

            <div className="note-warning" style={{marginTop:12}}>
              <span>⚠️</span>
              <span>Nota Importante: Si modificas tu nombre o apellido, deberás actualizar tu video de presentación para que la información sea consistente.</span>
            </div>

            <h2 className="datos-section-title" style={{marginTop:18}}>Mi Video de Presentación</h2>
            <div className="datos-video-grid">
              <div className="datos-video-card">
                <div className="datos-video-title">Video Actual</div>
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
                <div className="video-caption">"{currentVideoTitle || `Mi Presentación Profesional - ${fullName}`}"</div>
              </div>

              <div className="datos-video-card">
                <div className="datos-video-title">Nuevo Video Propuesto</div>
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
                <div className="video-caption">"{newVideoTitle || 'Nuevo Video Propuesto'}"</div>
              </div>
            </div>

            <h3 className="datos-section-title" style={{marginTop:12}}>Actualizar Video</h3>
            <p className="datos-help">Para actualizar tu video de presentación, pega la URL de un video de YouTube en el siguiente campo.</p>
            <form className="video-update-row" onSubmit={(e)=>{e.preventDefault(); if(newId){ setCurrentVideoUrl(newVideoUrl); setShowNewPreview(false);} }}>
              <input
                className="datos-input datos-input--soft"
                placeholder="https://youtu.be/… o https://www.youtube.com/watch?v=…"
                value={newVideoUrl}
                onChange={(e)=>setNewVideoUrl(e.target.value)}
              />
              <button type="submit" className="btn-green-outline">Guardar Video</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
