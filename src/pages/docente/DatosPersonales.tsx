import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import '../../styles/docente-datos.css';

export default function DocenteDatosPersonales() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '—' : '—';

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="content-center-xl">
          <div className="datos-card" aria-labelledby="datos-title">
            <div className="datos-avatar">
              <div className="datos-initials">{initials}</div>
            </div>
            <h1 id="datos-title" className="datos-title">{fullName}</h1>
            <p className="datos-subtitle">Gestiona tu información personal y seguridad.</p>

            <form className="datos-form" onSubmit={(e)=>e.preventDefault()}>
              <label className="datos-field">
                <span className="datos-label">Nombre</span>
                <input className="datos-input" placeholder="Nombre" defaultValue={user?.first_name ?? ''} />
              </label>
              <label className="datos-field">
                <span className="datos-label">Apellido</span>
                <input className="datos-input" placeholder="Apellido" defaultValue={user?.last_name ?? ''} />
              </label>

              <div className="datos-actions">
                <Link to="/auth/change-password" className="btn-green" role="button">Cambiar Contraseña</Link>
                <button type="submit" className="btn-green-outline">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
