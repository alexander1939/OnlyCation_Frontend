import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import { useUpdateProfile } from '../../hooks/auth/useUpdateProfile';
import { useState } from 'react';
import '../../styles/student-personal-data.css';

export default function EstudianteDatosPersonales() {
  const { user, setUser } = useAuthContext();
  const { updateUserName, loading, error } = useUpdateProfile();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setValidationError(null);

    // Validar que al menos un campo haya cambiado
    if (firstName === user?.first_name && lastName === user?.last_name) {
      setValidationError('No se detectaron cambios en los datos.');
      return;
    }

    // Validar que ambos campos estén presentes
    if (!firstName.trim() || !lastName.trim()) {
      setValidationError('Debes proporcionar tanto el nombre como el apellido.');
      return;
    }

    // Validar longitud máxima
    if (firstName.length > 50 || lastName.length > 50) {
      setValidationError('El nombre y apellido no pueden exceder los 50 caracteres.');
      return;
    }

    // Validar caracteres permitidos (letras, espacios y caracteres especiales comunes)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setValidationError('El nombre y apellido solo pueden contener letras y espacios.');
      return;
    }

    // Validar que no haya más de 2 letras consecutivas repetidas
    const repeatedCharsRegex = /(.)\1{2,}/;
    if (repeatedCharsRegex.test(firstName) || repeatedCharsRegex.test(lastName)) {
      setValidationError('El nombre y apellido no pueden tener más de 2 letras consecutivas iguales.');
      return;
    }

    // Validar que no haya secuencias largas de consonantes (más de 4 seguidas)
    // Esto ayuda a detectar "keyboard smashing" como "ananfaklnlaknklfa"
    const excessiveConsonantsRegex = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
    if (excessiveConsonantsRegex.test(firstName) || excessiveConsonantsRegex.test(lastName)) {
      setValidationError('El nombre y apellido contienen secuencias de letras no válidas.');
      return;
    }

    // Preparar datos para actualizar
    const updateData: { first_name?: string; last_name?: string } = {};
    if (firstName.trim() !== user?.first_name) {
      updateData.first_name = firstName.trim();
    }
    if (lastName.trim() !== user?.last_name) {
      updateData.last_name = lastName.trim();
    }

    // Llamar a la API
    const response = await updateUserName(updateData);

    if (response.success && response.data) {
      // Actualizar el contexto con los nuevos datos
      setUser({
        ...user!,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      });

      setSuccessMessage('¡Datos actualizados correctamente!');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/student-home');
      }, 2000);
    }
  };

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
              {/* Mensajes de éxito y error */}
              {successMessage && (
                <div style={{
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  borderRadius: '4px',
                  border: '1px solid #c3e6cb'
                }}>
                  {successMessage}
                </div>
              )}
              {error && (
                <div style={{
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '4px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}
              {validationError && (
                <div style={{
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  borderRadius: '4px',
                  border: '1px solid #ffeeba'
                }}>
                  {validationError}
                </div>
              )}

              <form className="sdp-form-grid" onSubmit={handleSubmit}>
                <label className="sdp-field">
                  <span className="sdp-label">Nombre</span>
                  <input
                    className="sdp-input"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setFirstName(value);
                      }
                    }}
                    disabled={loading}
                    maxLength={50}
                  />
                </label>
                <label className="sdp-field">
                  <span className="sdp-label">Apellidos</span>
                  <input
                    className="sdp-input"
                    placeholder="Apellidos"
                    value={lastName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setLastName(value);
                      }
                    }}
                    disabled={loading}
                    maxLength={50}
                  />
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
                    <button
                      type="submit"
                      className="sdp-btn sdp-btn--primary"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <Link to="/student-home" className="sdp-btn sdp-btn--secondary" role="button">Cancelar</Link>
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
