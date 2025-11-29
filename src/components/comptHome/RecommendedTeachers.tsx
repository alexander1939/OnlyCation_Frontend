import { useEffect, useRef, useState } from "react";
import { useTeachersContext } from "../../context/teachers";
import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";

export const RecommendedTeachers: React.FC = () => {
  const { teachers, loading, getTeachers } = useTeachersContext();
  const requestedRef = useRef(false);
  const [playing, setPlaying] = useState<Record<string, boolean>>({});

  const extractYouTubeId = (url?: string): string | null => {
    if (!url) return null;
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

  const getThumb = (thumb?: string, videoUrl?: string) => {
    if (thumb) return thumb;
    const id = extractYouTubeId(videoUrl);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  const getEmbed = (embedUrl?: string, videoUrl?: string) => {
    if (embedUrl && embedUrl.includes('/embed/')) {
      const join = embedUrl.includes('?') ? '&' : '?';
      return `${embedUrl}${join}autoplay=1&rel=0&mute=1&playsinline=1`;
    }
    const id = extractYouTubeId(videoUrl);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&mute=1&playsinline=1` : '';
  };

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    getTeachers(1, 3);
  }, [getTeachers]);

  const list = (teachers || [])
    .filter((t) => (t.user_id !== undefined && t.user_id !== null) || (t.teacher_id !== undefined && t.teacher_id !== null))
    .slice(0, 3);

  if (loading) {
    return <div className="shv2-recos"><div className="shv2-reco-card">Cargando docentes…</div></div>;
  }
  if (list.length === 0) return null;

  return (
    <div className="shv2-recos">
      {list.map((t) => {
        const id = (t.user_id ?? t.teacher_id) as number;
        const idStr = String(id);
        const name = `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Sin nombre';
        const subject = t.expertise_area || t.subject || 'Sin materia';
        const level = t.educational_level || 'Universidad';
        const rating = t.average_rating || 0;
        const thumb = getThumb(t.video_thumbnail_url, t.video_embed_url);
        const embed = getEmbed(t.video_embed_url, t.video_embed_url);
        const isPlaying = !!playing[idStr] && !!embed;

        return (
          <Link key={idStr} to={`/teachers/${id}`} className="shv2-reco-card" style={{ textDecoration: 'none' }}>
            <div
              className="shv2-reco-media"
              onMouseLeave={() => setPlaying((p) => ({ ...p, [idStr]: false }))}
            >
              {isPlaying ? (
                <iframe
                  src={embed}
                  title={name}
                  style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  {thumb ? (
                    <img src={thumb} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 700, fontSize: 12 }}>Video</div>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (embed) setPlaying((p) => ({ ...p, [idStr]: true })); }}
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.25))', border: 'none', cursor: 'pointer' }}
                    aria-label={`Reproducir video de ${name}`}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 9999, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                      <Play size={18} color="#0f172a" />
                    </div>
                  </button>
                </>
              )}
            </div>
            <div className="shv2-reco-info" style={{ flex: 1 }}>
              <div className="shv2-reco-name">{name}</div>
              <div className="shv2-pills">
                <span className="shv2-pill pill-sky">{subject}</span>
                <span className="shv2-pill pill-mint">{level}</span>
              </div>
              <div className="shv2-rating-badge">
                <Star size={14} color="#22c55e" fill="#22c55e" /> {rating.toFixed(1)}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};