import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuthContext } from '../../context/auth';
import '../../styles/estudiante-general.css';

export default function EstudianteGeneral() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '-';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '-' : '-';
  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="content-center-xl">
            <div className="page-card page-card--accent-sky page-card--narrow">
              <div className="card-header card-header--gradient-sky">
                <h2 className="card-title">Inicio (Estudiante)</h2>
                <div className="card-actions"><span className="chip">Activo</span></div>
              </div>

              <div className="profile-card profile-card--compact">
                <div className="avatar">
                  {initials}
                </div>
                <div className="profile-meta">
                  <span className="oc-text" style={{ fontWeight: 700 }}>{fullName}</span>
                  <span className="oc-text" style={{ opacity: 0.85 }}>{user?.email || '-'}</span>
                  <span className="badge">{user?.role === 'teacher' ? 'Docente' : 'Estudiante'}</span>
                </div>
              </div>

              <div className="actions-row">
                <Link to="/estudiante/datos-personales"><Button variant="primary">Editar perfil</Button></Link>
                <Link to="/auth/change-password"><Button variant="secondary" type="button">Cambiar contraseña</Button></Link>
              </div>

              <div className="divider" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="section-card">
                  <h3 className="font-semibold oc-text" style={{ marginBottom: 8 }}>Enlaces rápidos</h3>
                  <div className="link-chips">
                    <Link to="/teachers" className="chip chip--outline">Buscar tutores</Link>
                    <Link to="/estudiante/datos-personales" className="chip chip--outline">Mis datos</Link>
                    <Link to="/about-us" className="chip chip--outline">Sobre nosotros</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
