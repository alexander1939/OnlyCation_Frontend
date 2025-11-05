import { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import { WeeklyAgendaProvider } from '../../context/availability/WeeklyAgendaContext';
import { DocumentsProvider, useDocumentsContext } from '../../context/documents/DocumentsContext';
import { PreferencesProvider, usePreferencesContext } from '../../context/preferences/PreferencesContext';
import { PricesProvider, usePricesContext } from '../../context/prices/PricesContext';
import { AssessmentsProvider, useAssessmentsContext } from '../../context/assessments';
import { VideosProvider, useVideosContext } from '../../context/videos';
import DispAgenda from '../../components/DispAgenda';
import { Play, Star, BadgeDollarSign } from 'lucide-react';
import '../../styles/docente-general.css';
import '../../styles/docente-profile.css';

type TeacherReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  avatarUrl: string;
};

type TeacherProfile = {
  level: string;
  subject: string;
  rating: number;
  hourlyRate: number;
  videoUrl: string;
  reviews: TeacherReview[];
  bio: string;
};

function ProfileContent() {
  const { myDescription, getMyDescription, updateDescription, documents, updating, readDocuments } = useDocumentsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState('');

  useEffect(() => {
    readDocuments();
    getMyDescription();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempDescription(myDescription);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempDescription('');
  };

  const handleSave = async () => {
    const currentDoc = documents[0];
    if (!currentDoc) {
      alert('❌ No se encontró el documento');
      return;
    }

    const result = await updateDescription(currentDoc.id, tempDescription);
    if (result.success) {
      setIsEditing(false);
      alert('✅ Descripción actualizada exitosamente');
      await getMyDescription();
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  };

  return (
    <div className="bio-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 className="section-heading" style={{ margin: 0 }}>Descripción</h2>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleSave}
              disabled={updating}
              style={{
                background: '#10b981',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💾 Guardar
            </button>
            <button 
              onClick={handleCancel}
              disabled={updating}
              style={{
                background: '#6b7280',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        ) : (
          <button 
            onClick={handleEdit}
            style={{
              background: '#10b981',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '18px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
            title="Editar descripción"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            }}
          >
            ✏️
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea 
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          className="w-full border-2 border-blue-400 rounded px-3 py-2 min-h-[100px]"
          placeholder="Describe tu experiencia, especialidades, metodología..."
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            fontSize: '16px',
            fontFamily: 'inherit',
            lineHeight: '1.6'
          }}
        />
      ) : (
        <p className="bio-text">{myDescription || 'Sin descripción disponible'}</p>
      )}
    </div>
  );
}

function EducationalLevelChip() {
  const { educationalLevel, getEducationalLevel } = usePreferencesContext();

  useEffect(() => {
    getEducationalLevel();
  }, [getEducationalLevel]);

  return (
    <span className="meta-chip meta-chip-blue">{educationalLevel || 'Error'}</span>
  );
}

function ExpertiseAreaChip() {
  const { myExpertiseArea, getMyExpertiseArea } = useDocumentsContext();

  useEffect(() => {
    getMyExpertiseArea();
  }, [getMyExpertiseArea]);

  return (
    <span className="meta-chip meta-chip-mint">{myExpertiseArea || 'Matemáticas'}</span>
  );
}

function PriceDisplay() {
  const { myPrice, getMyPrice } = usePricesContext();

  useEffect(() => {
    getMyPrice();
  }, [getMyPrice]);

  return (
    <div className="stat">
      <BadgeDollarSign color="#68B2C9" width={20} height={20} />
      <span className="stat-value">${myPrice || 50}</span>
      <span className="stat-label">/ hora</span>
    </div>
  );
}

function RatingDisplay() {
  const { myRating, getMyRating } = useAssessmentsContext();

  useEffect(() => {
    getMyRating();
  }, [getMyRating]);

  return (
    <div className="stat">
      <Star color="#c78f00" fill="#c78f00" width={20} height={20} />
      <span className="stat-value">{(myRating ?? 4.9).toFixed(1)}</span>
      <span className="stat-label">Estrellas</span>
    </div>
  );
}

function VideoHero({ onPlayClick }: { onPlayClick: () => void }) {
  const { myVideoUrl, getMyVideoUrl } = useVideosContext();

  useEffect(() => {
    getMyVideoUrl();
  }, []);

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

  const videoId = myVideoUrl?.original_url 
    ? extractYouTubeId(myVideoUrl.original_url) 
    : null;
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : 'https://img.youtube.com/vi/ysz5S6PUM-U/maxresdefault.jpg';

  return (
    <div
      className="profile-hero"
      style={{ backgroundImage: `url(${thumbnailUrl})` }}
      aria-label="Video de presentación"
    >
      <div className="profile-hero-play">
        <button 
          className="profile-hero-btn" 
          onClick={onPlayClick}
          aria-label="Reproducir video"
        >
          <Play width={36} height={36} />
        </button>
      </div>
    </div>
  );
}

function VideoModal({ show, onClose }: { show: boolean, onClose: () => void }) {
  const { myVideoUrl } = useVideosContext();

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

  const videoId = myVideoUrl?.original_url 
    ? extractYouTubeId(myVideoUrl.original_url) 
    : null;
  const embedUrl = myVideoUrl?.embed_url ?? `https://www.youtube.com/embed/${videoId}`;

  if (!show) return null;

  return (
    <div className="video-modal-overlay" role="dialog" aria-modal="true">
      <div className="video-modal">
        <div className="video-aspect">
          <iframe
            src={embedUrl}
            title="Video de presentación"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button className="video-close" aria-label="Cerrar video" onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}

export default function DocenteProfile() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Docente';
  
  const [showVideo, setShowVideo] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile>({
    level: 'Universidad',
    subject: 'Matemáticas',
    rating: 4.9,
    hourlyRate: 50,
    videoUrl: 'https://youtu.be/tdFNA7YBM4c',
    bio:
      '¡Hola! Soy docente con más de 5 años de experiencia impartiendo clases a nivel universitario. Me apasiona ayudar a que cada estudiante comprenda los conceptos desde lo básico hasta lo avanzado, con ejemplos prácticos y un enfoque claro. Mis clases son dinámicas, personalizadas y enfocadas en objetivos reales: aprobar exámenes, reforzar bases y desarrollar pensamiento crítico.',
    reviews: [
      {
        id: 'r1',
        author: 'Carlos S.',
        date: 'Hace 2 semanas',
        rating: 5.0,
        comment:
          '"Jane es una profesora increíble. Su forma de explicar el cálculo es muy clara y me ayudó a pasar mi examen con una excelente nota. ¡Totalmente recomendada!"',
        avatarUrl: 'https://i.pravatar.cc/100?img=12',
      },
      {
        id: 'r2',
        author: 'Ana G.',
        date: 'Hace 1 mes',
        rating: 4.8,
        comment:
          '"Gracias a sus clases de álgebra, por fin entiendo temas que me parecían imposibles. Es muy paciente y se adapta a tu ritmo de aprendizaje."',
        avatarUrl: 'https://i.pravatar.cc/100?img=32',
      },
    ],
  });
  const teacherId = (user as any)?.id ?? 'me';

  const getTeacherCore = async (id: string): Promise<Partial<TeacherProfile>> => {
    try {
      const res = await fetch(`/api/teachers/${id}/core`);
      if (!res.ok) throw new Error('core');
      const j = await res.json();
      return { level: j.level, subject: j.subject, rating: Number(j.rating), bio: String(j.bio ?? '') };
    } catch {
      return {};
    }
  };

  const getTeacherPricing = async (id: string): Promise<Partial<TeacherProfile>> => {
    try {
      const res = await fetch(`/api/teachers/${id}/pricing`);
      if (!res.ok) throw new Error('pricing');
      const j = await res.json();
      return { hourlyRate: Number(j.hourlyRate) };
    } catch {
      return {};
    }
  };

  const getTeacherReviews = async (id: string): Promise<Partial<TeacherProfile>> => {
    try {
      const res = await fetch(`/api/teachers/${id}/reviews`);
      if (!res.ok) throw new Error('reviews');
      const j = await res.json();
      const reviews: TeacherReview[] = Array.isArray(j)
        ? j.map((r: any) => ({
            id: String(r.id ?? crypto.randomUUID()),
            author: String(r.author ?? r.userName ?? 'Anónimo'),
            date: String(r.date ?? r.createdAt ?? ''),
            rating: Number(r.rating ?? 0),
            comment: String(r.comment ?? r.text ?? ''),
            avatarUrl: String(r.avatarUrl ?? r.photoUrl ?? 'https://i.pravatar.cc/100'),
          }))
        : [];
      return { reviews };
    } catch {
      return {};
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const [core, pricing, reviews] = await Promise.all([
          getTeacherCore(teacherId),
          getTeacherPricing(teacherId),
          getTeacherReviews(teacherId),
        ]);
        if (cancelled) return;
        setProfile((prev) => ({
          ...prev,
          ...(core.level ? { level: core.level } : {}),
          ...(core.subject ? { subject: core.subject } : {}),
          ...(core.rating ? { rating: core.rating } : {}),
          ...(core.bio ? { bio: core.bio } : {}),
          ...(pricing.hourlyRate ? { hourlyRate: pricing.hourlyRate } : {}),
          ...(reviews.reviews ? { reviews: reviews.reviews } : {}),
        }));
      } catch (e: any) {
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  return (
    <VideosProvider>
      <AssessmentsProvider>
        <PreferencesProvider>
          <DocumentsProvider>
            <PricesProvider>
              <div className="min-h-screen flex flex-col page-container">
                <Header />
                <main className="flex-1 main-spacing">
                  <section className="docente-container">

                    <div className="profile-grid">
                      <div>
                        <VideoHero onPlayClick={() => setShowVideo(true)} />
                      </div>

                      <div>
                        <div className="profile-info-card">
                          <div className="profile-title-row">
                            <h1 className="profile-title">{fullName}</h1>
                          </div>
                          <div className="profile-meta-chips">
                            <EducationalLevelChip />
                            <ExpertiseAreaChip />
                          </div>

                          <div className="profile-stats">
                            <RatingDisplay />
                            <PriceDisplay />
                          </div>

                          <div className="profile-actions-row">
                            <Link to="/teacher/personal-data" className="profile-action primary">Editar datos personales</Link>
                            <Link to="/teacher/documents" className="profile-action secondary">Gestionar documentos</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="separator-mint" />

                    <ProfileContent />

                    <hr className="separator-mint" />

                    <div style={{ marginTop: 16 }}>
                      <h2 className="section-heading">Disponibilidad Semanal</h2>
                      <p className="section-sub">Para reservar, selecciona una hora disponible en la agenda.</p>

                      <div className="avail-card" style={{ marginTop: 12 }}>
                        <WeeklyAgendaProvider>
                          <DispAgenda />
                        </WeeklyAgendaProvider>
                      </div>

                      <div className="legend">
                        <div className="legend-item">
                          <span className="legend-dot" style={{ background: '#8ED4BE', border: '1px solid #8ED4BE' }} />
                          <span className="legend-text">Disponible</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot" style={{ background: '#FF9978', border: '1px solid #FF9978' }} />
                          <span className="legend-text">Reservado</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot" style={{ background: '#FAF9F5', border: '1px solid #E0E0E0' }} />
                          <span className="legend-text">No disponible</span>
                        </div>
                      </div>
                    </div>

                    <hr className="separator-yellow" />

                    <div>
                      <h2 className="section-heading">Reseñas de Alumnos</h2>
                      <div className="reviews-grid" style={{ marginTop: 12 }}>
                        {profile.reviews.map((r) => (
                          <article key={r.id} className="review-card">
                            <div className="review-top">
                              <div className="review-user">
                                <img alt={`Avatar de ${r.author}`} className="review-avatar" src={r.avatarUrl} />
                                <div>
                                  <p className="review-name">{r.author}</p>
                                  <p className="review-date">{r.date}</p>
                                </div>
                              </div>
                              <div className="review-pill">
                                <Star width={16} height={16} color="#c78f00" fill="#c78f00" />
                                <span>{r.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <p className="review-text">{r.comment}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>
                </main>
                <Footer />
                <VideoModal show={showVideo} onClose={() => setShowVideo(false)} />
              </div>
            </PricesProvider>
          </DocumentsProvider>
        </PreferencesProvider>
      </AssessmentsProvider>
    </VideosProvider>
  );
}
