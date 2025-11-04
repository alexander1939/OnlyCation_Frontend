import { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import { WeeklyAgendaProvider } from '../../context/availability/WeeklyAgendaContext';
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

export default function DocenteProfile() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Docente';
  
  const [showVideo, setShowVideo] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
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
  const videoUrl = profile.videoUrl;

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

  const getTeacherVideo = async (id: string): Promise<Partial<TeacherProfile>> => {
    try {
      const res = await fetch(`/api/teachers/${id}/video`);
      if (!res.ok) throw new Error('video');
      const j = await res.json();
      return { videoUrl: String(j.videoUrl) };
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
      // setLoading(true);
      // setError(null);
      try {
        const [core, pricing, video, reviews] = await Promise.all([
          getTeacherCore(teacherId),
          getTeacherPricing(teacherId),
          getTeacherVideo(teacherId),
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
          ...(video.videoUrl ? { videoUrl: video.videoUrl } : {}),
          ...(reviews.reviews ? { reviews: reviews.reviews } : {}),
        }));
      } catch (e: any) {
        // setError(e?.message ?? 'error');
      } finally {
        // if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

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

  const videoId = extractYouTubeId(videoUrl) ?? 'ysz5S6PUM-U';
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="docente-container">

          <div className="profile-grid">
            <div>
              <div
                className="profile-hero"
                style={{ backgroundImage: `url(${thumbnailUrl})` }}
                aria-label={`Video de presentación de ${fullName}`}
              >
                <div className="profile-hero-play">
                  <button className="profile-hero-btn" onClick={() => setShowVideo(true)} aria-label="Reproducir video">
                    <Play width={36} height={36} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="profile-info-card">
                <div className="profile-title-row">
                  <h1 className="profile-title">{fullName}</h1>
                </div>
                <div className="profile-meta-chips">
                  <span className="meta-chip meta-chip-blue">{profile.level}</span>
                  <span className="meta-chip meta-chip-mint">{profile.subject}</span>
                </div>

                <div className="profile-stats">
                  <div className="stat">
                    <Star color="#c78f00" fill="#c78f00" width={20} height={20} />
                    <span className="stat-value">{profile.rating.toFixed(1)}</span>
                    <span className="stat-label">Estrellas</span>
                  </div>
                  <div className="stat">
                    <BadgeDollarSign color="#68B2C9" width={20} height={20} />
                    <span className="stat-value">${profile.hourlyRate}</span>
                    <span className="stat-label">/ hora</span>
                  </div>
                </div>

                <div className="profile-actions-row">
                  <Link to="/teacher/personal-data" className="profile-action primary">Editar datos personales</Link>
                  <Link to="/teacher/documents" className="profile-action secondary">Gestionar documentos</Link>
                </div>
              </div>
            </div>
          </div>

          <hr className="separator-mint" />

          <div className="bio-card">
            <h2 className="section-heading">Descripción</h2>
            <p className="bio-text">{profile.bio}</p>
          </div>

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

      {showVideo && (
        <div className="video-modal-overlay" role="dialog" aria-modal="true">
          <div className="video-modal">
            <div className="video-aspect">
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title="Video de presentación"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button className="video-close" aria-label="Cerrar video" onClick={() => setShowVideo(false)}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
