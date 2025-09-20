import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RegisterForm from '../../components/RegisterForm';
import { useAuthContext } from '../../context/auth';
import '../../styles/Register.css';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacy_policy_accepted: boolean;
  rfc?: string;
  expertise_area?: string;
  certificate?: File | null;
  curriculum?: File | null;
}

type UserType = 'student' | 'teacher' | null;

function Register() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isContracting, setIsContracting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { registerStudent, registerTeacher } = useAuthContext();

  const handleUserTypeSelect = (type: 'student' | 'teacher') => {
    setUserType(type);
    setShowForm(true);
    setIsContracting(false);
  };

  const handleSidebarClick = (type: 'student' | 'teacher') => {
    if (userType && userType !== type && !isTransitioning) {
      setIsTransitioning(true);
      setShowForm(false);
      setError(null);
      
      // Fase 1: Ocultar formulario actual (200ms)
      setTimeout(() => {
        setIsContracting(true);
      }, 200);
      
      // Fase 2: Contraer elemento actual y expandir nuevo (400ms)
      setTimeout(() => {
        setUserType(type);
        setIsContracting(false);
      }, 600);
      
      // Fase 3: Mostrar nuevo formulario (200ms después)
      setTimeout(() => {
        setShowForm(true);
        setIsTransitioning(false);
      }, 800);
    }
  };

  const handleBackToSelection = () => {
    setIsContracting(true);
    setShowForm(false);
    setError(null);
    
    // Después de la animación, resetear el tipo de usuario
    setTimeout(() => {
      setUserType(null);
      setIsContracting(false);
    }, 800);
  };

  const handleSubmit = async (formData: RegisterFormData) => {
    if (!userType) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, rfc, expertise_area, certificate, curriculum, ...registerData } = formData;
      
      let response;
      if (userType === 'student') {
        response = await registerStudent(registerData);
      } else {
        response = await registerTeacher(registerData);
      }
      
      if (response.success) {
        setRegisteredUser({ email: registerData.email, first_name: registerData.first_name, last_name: registerData.last_name });
        setSuccess(true);
        
        if (userType === 'student') {
          // Redirigir después de 3 segundos para estudiantes
          setTimeout(() => {
            navigate('/', { 
              state: { 
                message: 'Registro exitoso. Ya puedes iniciar sesión.',
                email: formData.email 
              }
            });
          }, 3000);
        }
      }
    } catch (error: any) {
      setError(error.message || `Error al registrar ${userType === 'student' ? 'estudiante' : 'docente'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito para estudiante
  if (success && userType === 'student') {
    return (
      <div className="min-h-screen w-full page-container">
        <Header />
        <main className="main-spacing">
          <div className="content-center">
            <div className="success-card success-card--student">
              <div className="success-icon success-icon--student">
                ✅
              </div>
              
              <h1 className="success-title">
                ¡Registro Exitoso!
              </h1>
              
              <p className="success-desc">
                Tu cuenta de estudiante ha sido creada exitosamente. 
                Ya puedes acceder a todos nuestros tutores especializados.
              </p>
              
              <div className="redirect-box redirect-box--student">
                <p className="redirect-text">
                  Serás redirigido al inicio en unos segundos...
                </p>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pantalla de éxito para docente
  if (success && userType === 'teacher') {
    return (
      <div className="min-h-screen w-full page-container">
        <Header />
        <main className="main-spacing">
          <div className="content-center-lg">
            <div className="success-card success-card--teacher">
              <div className="success-icon success-icon--teacher">
                ✅
              </div>
              
              <h1 className="success-title">
                ¡Cuenta Creada!
              </h1>
              
              <p className="success-desc success-desc--lg">
                Hola <strong>{registeredUser?.first_name}</strong>, tu cuenta de docente ha sido 
                creada exitosamente en estado <strong>pendiente</strong>.
              </p>
              
              <div className="info-box">
                <h3 className="info-title">
                  👨‍🏫 Estado de tu Cuenta
                </h3>
                
                <div className="info-steps">
                  <div className="info-step">
                    <div className="info-badge info-badge--ok">
                      ✓
                    </div>
                    <span className="info-text info-text--ok">
                      Cuenta creada exitosamente en estado pendiente
                    </span>
                  </div>
                  
                  <div className="info-step">
                    <div className="info-badge info-badge--pending">
                      ⏳
                    </div>
                    <span className="info-text info-text--pending">
                      No se enviaron documentos (proceso opcional)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="teacher-note">
                <h4 className="teacher-note-title">
                  📋 Proceso de Verificación (Opcional)
                </h4>
                <ul className="info-list">
                  <li>Puedes iniciar sesión inmediatamente con tu cuenta pendiente</li>
                  <li>Para dar clases, deberás completar el proceso de verificación</li>
                  <li>Consulta el apartado <strong>Documentación/Activación</strong> en tu perfil</li>
                  <li>Sube tus documentos cuando decidas activar tu cuenta</li>
                </ul>
              </div>
              
              <div className="btn-row">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-outline"
                >
                  Volver al Inicio
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-success"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pantalla de selección inicial o con animación de expansión
  if (!success) {
    return (
      <div className="min-h-screen w-full page-container">
        <Header />
        
        <main className="main-spacing">
          
          
          <div className="content-center-xl">
            <h1 className="page-title">
              Únete a OnlyCation
            </h1>
            
            <p className="page-subtitle">
              Selecciona cómo quieres formar parte de nuestra comunidad
            </p>

            {/* Card dinámico con expansión */}
            <div
              className={
                `dynamic-card ${!userType ? 'is-closed clickable' : userType === 'student' ? 'is-student' : 'is-teacher'}`
              }
            >
              {/* Fondo expandido para estudiante */}
              {userType === 'student' && (
                <div className="bg-highlight bg-highlight--student" />
              )}
              
              {/* Fondo expandido para docente */}
              {userType === 'teacher' && (
                <div className="bg-highlight bg-highlight--teacher" />
              )}

              {/* Mitad Estudiante */}
              <div
                onClick={() => {
                  if (!userType) {
                    handleUserTypeSelect('student');
                  } else if (userType === 'teacher') {
                    handleSidebarClick('student');
                  }
                }}
                className={`panel panel-student ${
                  !userType ? 'is-initial' : userType === 'student' ? 'is-expanded' : 'is-sidebar'
                } ${
                  userType === 'student' && !isContracting && !isTransitioning ? 'expanding-student' :
                  isContracting && userType === 'student' ? 'contracting-student' :
                  userType === 'teacher' && !isContracting && !isTransitioning ? 'sidebar-student' :
                  isTransitioning ? 'transitioning' : ''
                }`}
              >
{userType !== 'student' && (
                  <>
                    <div style={{
                      fontSize: userType === 'teacher' ? '40px' : '80px',
                      marginBottom: userType === 'teacher' ? '10px' : '20px',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      transition: 'font-size 0.4s ease',
                      willChange: 'font-size'
                    }}>
                      🎓
                    </div>
                    <h2 style={{
                      fontSize: userType === 'teacher' ? '18px' : '32px',
                      fontWeight: 'bold',
                      marginBottom: userType === 'teacher' ? '8px' : '16px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'font-size 0.4s ease',
                      textAlign: 'center',
                      writingMode: userType === 'teacher' ? 'vertical-rl' : 'horizontal-tb',
                      textOrientation: userType === 'teacher' ? 'mixed' : 'unset',
                      willChange: 'font-size'
                    }}>
                      {userType === 'teacher' ? 'SOY ESTUDIANTE' : 'Soy Estudiante'}
                    </h2>
                    {userType !== 'teacher' && (
                      <p style={{
                        fontSize: '18px',
                        textAlign: 'center',
                        lineHeight: '1.6',
                        maxWidth: '280px',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '0',
                        transition: 'all 0.4s ease',
                        willChange: 'font-size, margin'
                      }}>
                        Accede a tutores especializados y mejora tus habilidades académicas
                      </p>
                    )}
                  </>
                )}
                
                {/* Formulario aparece aquí para estudiante */}
                {userType === 'student' && showForm && !isContracting && !isTransitioning && (
                  <div className="form-container form-wrap">
                    <RegisterForm 
                      userType={userType}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                )}
                
                {/* Formulario saliendo durante transición */}
                {userType === 'student' && !showForm && isTransitioning && (
                  <div className="form-container-exit form-wrap">
                    <RegisterForm 
                      userType="student"
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>

              {/* Mitad Docente */}
              <div
                onClick={() => {
                  if (!userType) {
                    handleUserTypeSelect('teacher');
                  } else if (userType === 'student') {
                    handleSidebarClick('teacher');
                  }
                }}
                className={`panel panel-teacher ${
                  !userType ? 'is-initial' : userType === 'teacher' ? 'is-expanded' : 'is-sidebar'
                } ${
                  userType === 'teacher' && !isContracting && !isTransitioning ? 'expanding-teacher' : 
                  isContracting && userType === 'teacher' ? 'contracting-teacher' :
                  userType === 'student' && !isContracting && !isTransitioning ? 'sidebar-teacher' : 
                  isTransitioning ? 'transitioning' : ''
                }`}
                style={{
                  writingMode: userType === 'student' ? 'vertical-rl' : 'horizontal-tb',
                  textOrientation: userType === 'student' ? 'mixed' : 'unset',
                  paddingTop: userType === 'teacher' ? '20px' : '0'
                }}
              >
{userType !== 'teacher' && (
                  <>
                    <div style={{
                      fontSize: userType === 'student' ? '40px' : '80px',
                      marginBottom: userType === 'student' ? '10px' : '20px',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      transition: 'font-size 0.4s ease',
                      willChange: 'font-size'
                    }}>
                      👨‍🏫
                    </div>
                    <h2 style={{
                      fontSize: userType === 'student' ? '18px' : '32px',
                      fontWeight: 'bold',
                      marginBottom: userType === 'student' ? '8px' : '16px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'font-size 0.4s ease',
                      textAlign: 'center',
                      writingMode: userType === 'student' ? 'vertical-rl' : 'horizontal-tb',
                      textOrientation: userType === 'student' ? 'mixed' : 'unset',
                      willChange: 'font-size'
                    }}>
                      {userType === 'student' ? 'SOY DOCENTE' : 'Soy Docente'}
                    </h2>
                    {userType !== 'student' && (
                      <p style={{
                        fontSize: '18px',
                        textAlign: 'center',
                        lineHeight: '1.6',
                        maxWidth: '280px',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '0',
                        transition: 'all 0.4s ease',
                        willChange: 'font-size, margin'
                      }}>
                        Comparte tu conocimiento y ayuda a estudiantes a alcanzar sus metas
                      </p>
                    )}
                  </>
                )}
                
                {/* Formulario aparece aquí para docente */}
                {userType === 'teacher' && showForm && !isContracting && !isTransitioning && (
                  <div className="form-container" style={{
                    width: '100%',
                    maxWidth: '580px',
                    padding: '0 30px 20px 30px',
                    margin: '0 auto'
                  }}>
                    <RegisterForm 
                      userType={userType}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                )}
                
                {/* Formulario saliendo durante transición */}
                {userType === 'teacher' && !showForm && isTransitioning && (
                  <div className="form-container-exit" style={{
                    width: '100%',
                    maxWidth: '580px',
                    padding: '0 30px 20px 30px',
                    margin: '0 auto'
                  }}>
                    <RegisterForm 
                      userType="teacher"
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>

              {/* Línea divisoria */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '10%',
                bottom: '10%',
                width: '2px',
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateX(-50%)',
                transition: 'opacity 0.6s ease',
                opacity: userType ? 0 : 1
              }} />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div style={{
                maxWidth: '600px',
                margin: '20px auto',
                padding: '16px 20px',
                backgroundColor: '#FEE2E2',
                borderRadius: '12px',
                border: '1px solid #EF4444'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>❌</span>
                  <p style={{
                    color: '#DC2626',
                    fontSize: '14px',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Botón para cambiar selección */}
            {userType && (
              <button
                onClick={handleBackToSelection}
                style={{
                  marginTop: '40px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '2px solid #6B7280',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6B7280';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                }}
              >
                ← Cambiar selección
              </button>
            )}

            {!userType && (
              <div style={{
                marginTop: '60px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#68B2C9',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Inicia sesión aquí
                  </button>
                </p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Esta pantalla ya no se usa porque el formulario aparece integrado en la selección
  return null;
};

export default Register;
