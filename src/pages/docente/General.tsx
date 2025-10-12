import { useAuthContext } from '../../context/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/docente-general.css';

export default function DocenteGeneral() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '-';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '-' : '-';
  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="content-center-xl">
            <div className="page-card page-card--accent-mint page-card--narrow">
              <div className="card-header card-header--gradient-mint">
                <h2 className="card-title">Inicio (Docente)</h2>
                <div className="card-actions"><span className="chip">Activo</span></div>
              </div>

              <div className="profile-card">
                <div className="avatar">
                  {initials}
                </div>
                <div className="profile-meta">
                  <span className="oc-text" style={{ fontWeight: 700 }}>{fullName}</span>
                  <span className="oc-text" style={{ opacity: 0.85 }}>{user?.email || '-'}</span>
                  <span className="badge">{user?.role === 'teacher' ? 'Docente' : 'Estudiante'}</span>
                </div>
              </div>

              <div className="section-card" style={{ marginTop: 16 }}>
                <h3 className="font-semibold oc-text" style={{ marginBottom: 8 }}>Próximas clases</h3>
                <p className="list-empty oc-text">Sin clases programadas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
