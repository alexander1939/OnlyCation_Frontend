// src/pages/student/StudentHome.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import SubjectsCatalog from "../../components/subjects/SubjectsCatalog";
import { Footer } from "../../components";
import { useLoginApi } from "../../hooks/auth/useLoginApi";
import WelcomeAlert from "../../components/WelcomeAlert";
import { CalendarDays, User2, GraduationCap } from "lucide-react";
import { MyNextClassesProvider, useMyNextClassesContext } from "../../context/booking";
import "../../styles/student-home-redesign.css";


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

  useEffect(() => {
    try {
      const shouldShow = sessionStorage.getItem("showWelcome") === "1";
      if (shouldShow) {
        setShowWelcome(true);
        sessionStorage.removeItem("showWelcome");
      }
    } catch {}
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

        {/* Profesores Recomendados (simple) */}
        <section>
          <h2 className="shv2-section-title">Profesores Recomendados</h2>
          <div className="shv2-recos">
            {[ 
              { name: 'Dr. Elena Vasquez', subject: 'Química Avanzada', stars: '★ ★ ★ ★ ★ (4.2)', avatar: 'EV' },
              { name: 'Marco Reyes', subject: 'Cálculo Integral', stars: '★ ★ ★ ★ ★ (4.9)', avatar: 'MR' },
              { name: 'Sofía Loren', subject: 'Literatura Universal', stars: '★ ★ ★ ★ ★ (4.7)', avatar: 'SL' },
            ].map(t => (
              <div key={t.name} className="shv2-reco-card">
                <div className="shv2-avatar">{t.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div className="shv2-reco-name">{t.name}</div>
                  <div className="shv2-reco-sub">{t.subject}</div>
                  <div className="shv2-stars">{t.stars}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default StudentHome;
