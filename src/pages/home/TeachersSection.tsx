import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

const TeachersSection: React.FC = () => {
  const { teachers, loading, getTeachers } = useTeachersContext();
  const [showVideo, setShowVideo] = useState(false);
  const [videoEmbed, setVideoEmbed] = useState<string>('');

  useEffect(() => {
    getTeachers(1, 3); // Cargar solo 3 profesores para la home
  }, []);

  const items = useMemo(() => {
    if (!teachers || !Array.isArray(teachers)) return [];
    
    console.log('👥 Teachers from backend:', teachers);
    
    return teachers
      .filter((t) => (t.user_id !== undefined && t.user_id !== null) || (t.teacher_id !== undefined && t.teacher_id !== null))
      .map((t) => {
        const id = t.user_id || t.teacher_id;
        const subject = t.expertise_area || t.subject;
        const price = t.price_per_hour || t.price_per_class;
        
        console.log(`🎬 Processing teacher ${t.first_name}:`, {
          video_embed_url: t.video_embed_url,
          video_thumbnail_url: t.video_thumbnail_url
        });
        
        // Usar thumbnail del backend o imagen por defecto
        const thumbnailUrl = t.video_thumbnail_url || '/Gemini_Generated_Image_ccdndiccdndiccdn.png';
        
        const item = {
          id: id!.toString(),
          name: `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Sin nombre',
          subject: subject || 'Sin materia',
          level: (t.educational_level || 'Universidad') as 'Preparatoria' | 'Universidad' | 'Posgrado',
          hourlyRate: price || 0,
          rating: t.average_rating || 0,
          available: true,
          videoUrl: t.video_embed_url || '',
          thumbnailUrl: thumbnailUrl
        } as TeacherItem;
        
        console.log('📝 Final item:', {
          name: item.name,
          videoUrl: item.videoUrl,
          thumbnailUrl: item.thumbnailUrl
        });
        return item;
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
    console.log('🎥 onPlay called with URL:', url);
    console.log('📊 Current showVideo state:', showVideo);
    
    if (!url) {
      console.log('❌ URL is empty or undefined');
      return;
    }
    
    // Si ya es una URL de embed, usarla directamente
    if (url.includes('youtube.com/embed/')) {
      const finalUrl = `${url}?autoplay=1`;
      console.log('✅ Using embed URL directly:', finalUrl);
      setVideoEmbed(finalUrl);
      setShowVideo(true);
      console.log('✅ setShowVideo(true) called - Modal should open');
      return;
    }
    
    // Si es youtu.be, convertir
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      if (id) {
        const finalUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
        console.log('✅ Converted youtu.be URL:', finalUrl);
        setVideoEmbed(finalUrl);
        setShowVideo(true);
        console.log('✅ setShowVideo(true) called - Modal should open');
      }
      return;
    }
    
    // Si no, intentar extraer el ID manualmente
    const id = extractYouTubeId(url);
    console.log('🔍 Extracted YouTube ID:', id);
    if (!id) {
      console.log('❌ Could not extract YouTube ID');
      return;
    }
    const finalUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    console.log('✅ Final embed URL:', finalUrl);
    setVideoEmbed(finalUrl);
    setShowVideo(true);
    console.log('✅ setShowVideo(true) called - Modal should open');
  };

  const handleCardClick = (teacherId: string) => {
    console.log('Navigate to teacher profile:', teacherId);
    // TODO: Navegar al perfil del profesor
  };

  return (
    <section className="px-[20px] mb-[100px]" style={{backgroundColor: '#FAF9F5', fontFamily: 'Roboto, sans-serif'}}>
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-[60px]">
          <h2 className="text-[42px] font-bold mb-4" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>
            Los Mejores Docentes
          </h2>
          <p className="text-[18px] text-[#718096]" style={{fontFamily: 'Roboto, sans-serif'}}>
            Descubre a nuestros tutores más destacados
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando docentes...</p>
          </div>
        ) : (
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
                      <Link 
                        className="link-profile"
                        to={`/catalog/teachers/${t.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCardClick(t.id);
                        }}
                      >
                        Ver Perfil
                        <span className="arrow-icon">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Botón Ver más */}
            <div className="text-center mt-[60px]">
              <Link 
                to="/catalog/teachers"
                className="inline-block text-[18px] font-semibold tracking-[0.5px] transition-colors" 
                style={{
                  backgroundColor: '#294954', 
                  color: '#FAF9F5', 
                  padding: '12px 24px', 
                  borderRadius: '20px', 
                  border: '2px solid #294954',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Roboto, sans-serif'
                }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
              >
                Ver más docentes
              </Link>
            </div>
          </>
        )}
      </div>

      {showVideo && (
        <div 
          className="video-modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          onClick={() => setShowVideo(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="video-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '880px',
              width: '90%',
              backgroundColor: '#000',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div className="video-aspect" style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%'
            }}>
              <iframe 
                src={videoEmbed} 
                title="Video de presentación" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
              />
              <button 
                className="video-close" 
                aria-label="Cerrar video" 
                onClick={() => setShowVideo(false)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#000',
                  zIndex: 10
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeachersSection;
