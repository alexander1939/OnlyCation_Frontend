import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import '../../styles/student-personal-data.css';

export default function EstudianteDatosPersonales() {
  const { user } = useAuthContext();
  return (
    <div className="student-data-v1">
      <Header />
      <main className="sdp-container">
        <section className="sdp-wrap">
          <div className="sdp-card" aria-labelledby="estudiante-datos-title">
            <div className="sdp-header">
              <h1 id="estudiante-datos-title" className="sdp-title">Datos Personales</h1>
              <p className="sdp-subtitle">Actualiza tu información básica</p>
            </div>
            <div className="sdp-body">
              <form className="sdp-form-grid" onSubmit={(e) => e.preventDefault()}>
                <label className="sdp-field">
                  <span className="sdp-label">Nombre</span>
                  <input className="sdp-input" placeholder="Nombre" defaultValue={user?.first_name ?? ''} />
                </label>
                <label className="sdp-field">
                  <span className="sdp-label">Apellidos</span>
                  <input className="sdp-input" placeholder="Apellidos" defaultValue={user?.last_name ?? ''} />
                </label>

                <label className="sdp-field">
                  <span className="sdp-label">Correo (no editable)</span>
                  <input className="sdp-input" type="email" disabled aria-readonly placeholder="correo@ejemplo.com" defaultValue={user?.email ?? ''} />
                </label>

                <div className="sdp-info">
                  Solo puedes editar tu nombre y apellidos. Para cambiar tu contraseña utiliza el botón "Cambiar contraseña".
                </div>

                <div className="sdp-actions">
                  <div className="sdp-actions-left">
                    <button type="submit" className="sdp-btn sdp-btn--primary">Guardar cambios</button>
                    <Link to="/estudiante/general" className="sdp-btn sdp-btn--secondary" role="button">Cancelar</Link>
                  </div>
                  <div className="sdp-actions-right">
                    <Link to="/auth/change-password" className="sdp-btn sdp-btn--outline" role="button">Cambiar contraseña</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
