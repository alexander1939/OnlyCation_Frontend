import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';

interface SuccessRegProps {
  type: 'student' | 'teacher';
  registeredUser?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  autoRedirect?: boolean;
  redirectTo?: string;
  redirectDelayMs?: number;
}

function SuccessReg({
  type,
  registeredUser,
  autoRedirect = false,
  redirectTo = '/',
  redirectDelayMs = 3000,
}: SuccessRegProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (type === 'student' && autoRedirect) {
      const t = setTimeout(() => navigate(redirectTo), redirectDelayMs);
      return () => clearTimeout(t);
    }
  }, [type, autoRedirect, navigate, redirectTo, redirectDelayMs]);

  const isStudent = type === 'student';

  return (
    <div className="min-h-screen w-full page-container">
      <Header />
      <main className="main-spacing">
        <div className={isStudent ? 'content-center' : 'content-center-lg'}>
          <div className={`success-card ${isStudent ? 'success-card--student' : 'success-card--teacher'}`}>
            <div className={`success-icon ${isStudent ? 'success-icon--student' : 'success-icon--teacher'}`}>
              ✅
            </div>

            <h1 className="success-title">
              {isStudent ? '¡Registro Exitoso!' : '¡Cuenta Creada!'}
            </h1>

            {isStudent ? (
              <>
                <p className="success-desc">
                  Tu cuenta de estudiante ha sido creada exitosamente.
                  Ya puedes acceder a todos nuestros tutores especializados.
                </p>
                <div className="redirect-box redirect-box--student">
                  <p className="redirect-text">
                    Serás redirigido al inicio en unos segundos...
                  </p>
                </div>
                <button onClick={() => navigate('/login')} className="btn btn-primary">
                  Ir a Iniciar Sesión
                </button>
              </>
            ) : (
              <>
                <p className="success-desc success-desc--lg">
                  Hola <strong>{registeredUser?.first_name}</strong>, tu cuenta de docente ha sido
                  creada exitosamente en estado <strong>pendiente</strong>.
                </p>

                <div className="info-box">
                  <h3 className="info-title">🧑‍🏫 Estado de tu Cuenta</h3>
                  <div className="info-steps">
                    <div className="info-step">
                      <div className="info-badge info-badge--ok">✓</div>
                      <span className="info-text info-text--ok">
                        Cuenta creada exitosamente en estado pendiente
                      </span>
                    </div>
                    <div className="info-step">
                      <div className="info-badge info-badge--pending">⏳</div>
                      <span className="info-text info-text--pending">
                        No se enviaron documentos (Proceso obligatorio para activar tu cuenta)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="teacher-note">
                  <h4 className="teacher-note-title">
                    📋 Proceso de Verificación (Proceso obligatorio para activar tu cuenta)
                  </h4>
                  <ul className="info-list">
                    <li>Puedes iniciar sesión inmediatamente con tu cuenta pendiente</li>
                    <li>Para dar clases, deberás completar el proceso de verificación</li>
                    <li>
                      Consulta el apartado <strong>Documentación/Activación</strong> en tu perfil
                    </li>
                    <li>Sube tus documentos cuando decidas activar tu cuenta</li>
                  </ul>
                </div>

                <div className="btn-row">
                  <button onClick={() => navigate('/')} className="btn btn-outline">
                    Volver al Inicio
                  </button>
                  <button onClick={() => navigate('/login')} className="btn btn-success">
                    Iniciar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SuccessReg;