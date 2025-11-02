import React from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { Link } from 'react-router-dom';
import '../../styles/docente-datos.css';

type PersonalDataViewProps = {
  user: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
  } | null;
  onSubmit?: (data: { first_name: string; last_name: string }) => void;
};

export default function PersonalDataView({ user, onSubmit }: PersonalDataViewProps) {
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '—' : '—';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    onSubmit?.({ first_name, last_name });
  };

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

            <form className="datos-form" onSubmit={handleSubmit}>
              <label className="datos-field">
                <span className="datos-label">Nombre</span>
                <input 
                  name="first_name"
                  className="datos-input" 
                  placeholder="Nombre" 
                  defaultValue={user?.first_name ?? ''} 
                />
              </label>
              <label className="datos-field">
                <span className="datos-label">Apellido</span>
                <input 
                  name="last_name"
                  className="datos-input" 
                  placeholder="Apellido" 
                  defaultValue={user?.last_name ?? ''} 
                />
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
