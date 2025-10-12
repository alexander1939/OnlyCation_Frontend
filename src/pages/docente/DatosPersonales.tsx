import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import '../../styles/docente-datos.css';

export default function DocenteDatosPersonales() {
  const { user } = useAuthContext();
  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="content-center-xl">
          <div className="page-card page-card--accent-mint page-card--narrow" aria-labelledby="docente-datos-title">
            <div className="card-header card-header--gradient-mint">
              <div>
                <h1 id="docente-datos-title" className="card-title">Datos Personales (Docente)</h1>
                <p className="card-subtitle">Actualiza tu información profesional</p>
              </div>
            </div>

            <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
              <label className="field">
                <span className="text-sm font-medium oc-text">Nombre</span>
                <input className="input" placeholder="Nombre" defaultValue={user?.first_name ?? ''} />
              </label>
              <label className="field">
                <span className="text-sm font-medium oc-text">Apellidos</span>
                <input className="input" placeholder="Apellidos" defaultValue={user?.last_name ?? ''} />
              </label>
              <label className="field md:col-span-2">
                <span className="text-sm font-medium oc-text">Correo</span>
                <input className="input" type="email" placeholder="correo@ejemplo.com" defaultValue={user?.email ?? ''} />
              </label>

              <div className="actions-row md:col-span-2">
                <Button type="submit" variant="primary">Guardar cambios</Button>
                <Link to="/auth/change-password"><Button variant="outline" type="button">Cambiar contraseña</Button></Link>
                <Link to="/docente/general"><Button variant="secondary" type="button">Cancelar</Button></Link>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
