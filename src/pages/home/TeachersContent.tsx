import React, { useEffect, useMemo, useState } from 'react';
import { useTeachersContext } from '../../context/teachers/TeachersContext';
import '../../styles/teacher-catalog.css';

type TeacherItem = {
  id: string;
  name: string;
  subject: string;
  level: 'Preparatoria' | 'Universidad' | 'Posgrado';
  hourlyRate: number;
  rating: number;
  available: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
};

const TeachersContent: React.FC = () => {
  const { teachers, loading, getTeachers } = useTeachersContext();
  const [showVideo, setShowVideo] = useState(false);
  const [videoEmbed, setVideoEmbed] = useState<string>('');

  useEffect(() => {
    getTeachers(1, 6); // Cargar solo 6 profesores para la home
  }, []);

  const items = useMemo(() => {
    if (!teachers || !Array.isArray(teachers)) return [];
    
    return teachers
      .filter((t) => (t.user_id !== undefined && t.user_id !== null) || (t.teacher_id !== undefined && t.teacher_id !== null))
      .map((t) => {
        const thumbnailUrl = t.video_thumbnail_url || 'https://img.youtube.com/vi/ysz5S6PUM-U/maxresdefault.jpg';
        const id = t.user_id || t.teacher_id;
        const subject = t.expertise_area || t.subject;
        const price = t.price_per_hour || t.price_per_class;
        
        return {
          id: id!.toString(),
          name: `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Sin nombre',
          subject: subject || 'Sin materia',
          level: (t.educational_level || 'Universidad') as 'Preparatoria' | 'Universidad' | 'Posgrado',
          hourlyRate: price || 0,
          rating: t.average_rating || 0,
          available: true,
          videoUrl: t.video_embed_url || '',
          thumbnailUrl
        } as TeacherItem;
      });
  }, [teachers]);

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
      }
    } catch { }
    return null;
  };

  const onPlay = (url: string) => {
    const id = extractYouTubeId(url);
    if (!id) return;
    setVideoEmbed(`https://www.youtube.com/embed/${id}?autoplay=1`);
    setShowVideo(true);
  };

  const handleCardClick = (teacherId: string) => {
    console.log('Navigate to teacher profile:', teacherId);
    // TODO: Navegar al perfil del profesor
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cargando docentes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="cards-grid">
        {items.map((t, idx) => (
          <article 
            key={t.id} 
            className="card card-appear" 
            style={{ animationDelay: `${idx * 80}ms` }}
            onClick={() => handleCardClick(t.id)}
          >
            <div className="card-video" style={{ backgroundImage: `url(${t.thumbnailUrl})` }} aria-label={`Video de ${t.name}`}>
              <button 
                className="card-play" 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(t.videoUrl);
                }} 
                aria-label={`Reproducir video de ${t.name}`}
              >
                ▶
              </button>
            </div>
            <div className="card-body">
              <div className="card-header">
                <h3 className="card-name" title={t.name}>{t.name}</h3>
                {t.available && <span className="badge-available">Disponible</span>}
              </div>
              <div className="card-meta">
                <span className="chip chip-subject">{t.subject}</span>
                <span className="chip chip-level">{t.level}</span>
              </div>
              <div className="card-actions">
                <div className="info-boxes">
                  <div className="info-box price-box">
                    <span className="info-value">${t.hourlyRate}</span>
                    <span className="info-label">MXN/HORA</span>
                  </div>
                  <div className="info-box rating-box">
                    <div className="rating-content">
                      <span className="star-icon">★</span>
                      <span className="info-value">{t.rating.toFixed(1)}</span>
                    </div>
                    <span className="info-label">CALIFICACIÓN</span>
                  </div>
                </div>
                <a 
                  className="link-profile"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick(t.id);
                  }}
                  href="#"
                >
                  Ver Perfil
                  <span className="arrow-icon">→</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {showVideo && (
        <div className="video-modal-overlay" role="dialog" aria-modal="true">
          <div className="video-modal">
            <div className="video-aspect">
              <iframe src={videoEmbed} title="Video de presentación" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              <button className="video-close" aria-label="Cerrar video" onClick={() => setShowVideo(false)}>✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeachersContent;
