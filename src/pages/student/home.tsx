// src/pages/student/StudentHome.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import SubjectsCatalog from "../../components/subjects/SubjectsCatalog";
import { Footer } from "../../components";
import { useLoginApi } from "../../hooks/auth/useLoginApi";
import WelcomeAlert from "../../components/WelcomeAlert";
import { CalendarDays, User2, GraduationCap} from "lucide-react";
import { MyNextClassesProvider, useMyNextClassesContext } from "../../context/booking";
import { useTeachersApi, type Teacher } from "../../hooks/teachers/useTeachersApi";
import "../../styles/student-home-redesign.css";
import { TeachersProvider } from "../../context/teachers/TeachersContext";
import { RecommendedTeachers } from "../../components/comptHome/RecommendedTeachers"
import LoadingOverlay from "../../components/shared/LoadingOverlay";


// Tarjeta de Próxima Reserva (consume contexto existente de booking)
const NextBookingCard: React.FC = () => {
  const { loading, error, classes, fetchMyNextClasses } = useMyNextClassesContext();
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    fetchMyNextClasses();
  }, [fetchMyNextClasses]);

  const next = classes && classes.length > 0 ? classes[0] : null;
  const start = next ? new Date(next.start_time) : null;
  const dateLabel = start
    ? `${start.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`
    : '';
  const timeLabel = start
    ? start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="shv2-card">
      <div className="shv2-card-badge"><CalendarDays color="#1d9ad6" size={18} /></div>
      <div className="shv2-card-title">
        <span>Próxima Reserva</span>
      </div>
      {loading && (
        <div className="shv2-card-sub">Cargando tu próxima clase…</div>
      )}
      {!loading && error && (
        <div className="shv2-card-sub" style={{ color: '#b91c1c' }}>No fue posible cargar tus reservas.</div>
      )}
      {!loading && !error && next && (
        <>
          <div className="shv2-card-sub" style={{ marginTop: 4, fontWeight: 800, color: '#0f172a' }}>
            {next.materia} con {next.teacher?.first_name} {next.teacher?.last_name}
          </div>
          <div style={{ color: '#475569', marginTop: 4 }}>
            {dateLabel} {timeLabel && `• ${timeLabel}`}
          </div>
        </>
      )}
      {!loading && !error && !next && (
        <div className="shv2-card-sub">Aún no tienes reservas próximas</div>
      )}
      <div style={{ marginTop: 10 }}>
        <Link to="/student/my_next_booking" className="shv2-link">Ver todas mis reservas</Link>
      </div>
    </div>
  );
};

const StudentHome: React.FC = () => {
  const { user } = useLoginApi();
  const [showWelcome, setShowWelcome] = useState(false);
  const { searchTeachers } = useTeachersApi();
  const [recommendedTeachers, setRecommendedTeachers] = useState<Teacher[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState<boolean>(false);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  useEffect(() => {
    try {
      const shouldShow = sessionStorage.getItem("showWelcome") === "1";
      if (shouldShow) {
        setShowWelcome(true);
        sessionStorage.removeItem("showWelcome");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoadingRecommended(true);
        setErrorRecommended(null);
        const res = await searchTeachers({
          min_rating: 4,
          page: 1,
          page_size: 3,
        });
        const data = res.data || [];
        setRecommendedTeachers(data.slice(0, 3));
      } catch (e) {
        setErrorRecommended("No fue posible cargar profesores recomendados");
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <div className="student-home-v2">
      <Header />

      {showWelcome && (
        <WelcomeAlert name={user?.first_name || "Student"} />
      )}

      <main className="shv2-container">
        <div className="shv2-hero-wrap">
          {/* Hero */}
          <section className="shv2-hero">
            <h1>
              Hola, {user?.first_name ? `${user.first_name}!` : 'Estudiante!'}
            </h1>
            <p>Listo para tu próxima asesoría? Encuentra a tu profesor ideal.</p>
          </section>

          {/* Summary cards */}
          <section className="shv2-summary">
            {/* Próxima Reserva (con provider local) */}
            <MyNextClassesProvider>
              <NextBookingCard />
            </MyNextClassesProvider>

            {/* Datos Personales */}
            <Link to="/student/personal-data" className="shv2-card" style={{ textDecoration: 'none' }}>
              <div className="shv2-card-badge"><User2 color="#1d9ad6" size={18} /></div>
              <div className="shv2-card-title"><span>Datos Personales</span></div>
              <div className="shv2-card-sub">Edita tu información</div>
            </Link>

            {/* Catálogo de Profesores */}
            <Link to="/catalog/teachers" className="shv2-card" style={{ textDecoration: 'none' }}>
              <div className="shv2-card-badge"><GraduationCap color="#1d9ad6" size={18} /></div>
              <div className="shv2-card-title"><span>Catálogo de Profesores</span></div>
              <div className="shv2-card-sub">Explora todos los perfiles</div>
            </Link>
          </section>
        </div>

        {/* Materias Populares (usar carrusel del Home guest) */}
        <section>
          <h2 className="shv2-section-title">Materias Populares</h2>
          <div>
            <SubjectsCatalog />
          </div>
        </section>

        {/* Profesores Recomendados (dinámico, hasta 3) */}
        <section>
          <h2 className="shv2-section-title">Profesores Recomendados</h2>
          <div className="shv2-recos">
            {loadingRecommended && (
              <div className="shv2-reco-card">
                <div style={{ flex: 1 }}>
                  <div className="shv2-reco-name">Cargando profesores recomendados...</div>
                </div>
              </div>
            )}
            {!loadingRecommended && errorRecommended && (
              <div className="shv2-reco-card">
                <div style={{ flex: 1 }}>
                  <div className="shv2-reco-name">{errorRecommended}</div>
                </div>
              </div>
            )}
            {!loadingRecommended && !errorRecommended && recommendedTeachers.length === 0 && (
              <div className="shv2-reco-card">
                <div style={{ flex: 1 }}>
                  <div className="shv2-reco-name">No hay profesores recomendados disponibles por ahora</div>
                </div>
              </div>
            )}
            {!loadingRecommended && !errorRecommended && recommendedTeachers.map((t) => {
              const initials = `${t.first_name?.[0] || ''}${t.last_name?.[0] || ''}`.toUpperCase();
              const ratingLabel = typeof t.average_rating === 'number'
                ? `★ ★ ★ ★ ★ (${t.average_rating.toFixed(1)})`
                : 'Sin calificaciones';

              return (
                <div key={t.user_id || t.teacher_id || `${t.first_name}-${t.last_name}`} className="shv2-reco-card">
                  <div className="shv2-avatar">{initials}</div>
                  <div style={{ flex: 1 }}>
                    <div className="shv2-reco-name">{t.first_name} {t.last_name}</div>
                    <div className="shv2-reco-sub">{t.subject || t.expertise_area || 'Docente'}</div>
                    <div className="shv2-stars">{ratingLabel}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <LoadingOverlay
        open={Boolean(loadingRecommended)}
        message="Preparando tu experiencia..."
        logoSrc="/logo.png"
        gifSrc="/icons8-rhombus-loader-96.gif"
      />
    </div>
  );
}

export default StudentHome;
