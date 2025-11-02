import React from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import '../../styles/docente-general.css';

type Clase = {
  id: string;
  diaHora: string;
  titulo: string;
  inscritos: number;
};

type BookingViewProps = {
  user: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
  } | null;
  clases?: Clase[];
};

export default function BookingView({ user, clases = [] }: BookingViewProps) {
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '-';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '-' : '-';
  const roleLabel = user?.role === 'teacher' ? 'Profesor/a' : 'Estudiante';

  // Clases de ejemplo si no se proporcionan
  const defaultClases: Clase[] = [
    { id: '1', diaHora: 'Lunes, 10:00', titulo: 'Álgebra Lineal', inscritos: 12 },
    { id: '2', diaHora: 'Miércoles, 08:00', titulo: 'Cálculo Diferencial', inscritos: 18 },
    { id: '3', diaHora: 'Viernes, 14:00', titulo: 'Estadística Aplicada', inscritos: 9 },
  ];

  const displayClases = clases.length > 0 ? clases : defaultClases;

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="docente-container">
          <div className="perfil-row">
            <div className="perfil-avatar">
              <div className="perfil-avatar-initials">{initials}</div>
            </div>
            <div className="perfil-info">
              <h1 className="perfil-nombre">{fullName}</h1>
              <div className="perfil-email">{user?.email || '-'}</div>
              <div className="perfil-rol">{roleLabel}</div>
            </div>
          </div>

          <div className="clases-header">
            <h2 className="clases-title">Próximas Clases</h2>
            <button className="ver-todas">Ver todas</button>
          </div>

          <div className="clases-grid">
            {displayClases.map((c) => (
              <article key={c.id} className="clase-card">
                <div className="clase-top">
                  <span className="clase-fecha">{c.diaHora}</span>
                </div>
                <h3 className="clase-titulo">{c.titulo}</h3>
                <div className="clase-footer">
                  <div className="alumnos">
                    <div className="alumno"/>
                    <div className="alumno"/>
                    <div className="alumno"/>
                    <span className="inscritos">+{c.inscritos}</span>
                  </div>
                  <span className="flecha" aria-hidden>→</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
