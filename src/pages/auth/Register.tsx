import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import RegisterForm from '../../components/registerComp/RegisterForm';
import { useRegisterAuthContext } from '../../context/regAuth';
import '../../styles/Register.css';
import SuccessReg from '../../components/registerComp/SuccessReg';

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
  const [pendingType, setPendingType] = useState<UserType>(null);
  const navigate = useNavigate();
  const { registerStudent, registerTeacher } = useRegisterAuthContext();

  // Visibilidad para animar el título y subtítulo al montar
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // activar en el siguiente tick para permitir la transición
    const t = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(t);
  }, []);

  const handleUserTypeSelect = (type: 'student' | 'teacher') => {
    setUserType(type);
    setShowForm(true);
    setIsContracting(false);
  };

  const handleSidebarClick = (type: 'student' | 'teacher') => {
    if (userType && userType !== type && !isTransitioning) {
      // Inicia transición: ocultar formulario actual y preparar overlay
      setIsTransitioning(true);
      setShowForm(false);
      setError(null);
      setPendingType(type);
      setIsContracting(false);
      // Cambiamos de lado inmediatamente para que el ancho del panel se anime debajo del overlay
      setUserType(type);
    }
  };

  const handleBackToSelection = () => {
    // Inicia transición inversa: ocultar formulario y usar overlay desde el lado activo
    setShowForm(false);
    setError(null);
    if (!isTransitioning) {
      setIsTransitioning(true);
      setPendingType(userType); // usa el color/dirección del panel activo
      setUserType(null); // vuelve a 50/50 bajo el overlay
      setIsContracting(false);
    }
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
      }
    } catch (error: any) {
      setError(error.message || `Error al registrar ${userType === 'student' ? 'estudiante' : 'docente'}`);
      throw error; // Re-lanzar el error para que RegisterForm lo capture
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito para estudiante
  if (success && userType === 'student') {
    return (
      <SuccessReg type="student" autoRedirect redirectTo="/" redirectDelayMs={3000} />
    );
  }

  // Pantalla de éxito para docente
  if (success && userType === 'teacher') {
    return (
      <SuccessReg type="teacher" registeredUser={registeredUser} />
    );
  }

  // Pantalla de selección inicial o con animación de expansión
  if (!success) {
    return (
      <div className="min-h-screen w-full page-container">
        <Header />
        
        <main className="main-spacing">
          
          
          <div className="content-center-xl">
            <h1 className={`page-title transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Únete a OnlyCation
            </h1>
            
            <p className={`page-subtitle transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Selecciona cómo quieres formar parte de nuestra comunidad
            </p>

            {/* Card dinámico con expansión */}
            <div
              className={
                `dynamic-card ${!userType ? 'is-closed clickable' : userType === 'student' ? 'is-student' : 'is-teacher'}${isTransitioning ? ' is-transitioning' : ''}`
              }
            >
              {/* Sweep overlay to simulate parchment roll covering opposite panel */}
              {isTransitioning && pendingType && (
                <div
                  className={`sweep-overlay ${pendingType === 'student' ? 'sweep-student' : 'sweep-teacher'}`}
                  onAnimationEnd={() => {
                    // Solo mostrar el formulario si hay un userType activo
                    if (userType) {
                      setShowForm(true);
                    }
                    setIsTransitioning(false);
                    setPendingType(null);
                  }}
                />
              )}
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
                className={`panel panel-student ${!userType ? 'is-initial' : userType === 'student' ? 'is-expanded' : 'is-sidebar'}`}
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
                    <button
                      type="button"
                      aria-label="Cerrar formulario"
                      className={`close-btn close-student ${isTransitioning ? 'is-disabled' : ''}`}
                      onClick={handleBackToSelection}
                      disabled={isTransitioning}
                    >
                      ×
                    </button>
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
                className={`panel panel-teacher ${!userType ? 'is-initial' : userType === 'teacher' ? 'is-expanded' : 'is-sidebar'}`}
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
                    <button
                      type="button"
                      aria-label="Cerrar formulario"
                      className={`close-btn close-teacher ${isTransitioning ? 'is-disabled' : ''}`}
                      onClick={handleBackToSelection}
                      disabled={isTransitioning}
                    >
                      ×
                    </button>
                    <RegisterForm 
                      userType={userType}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                )}
                
                {/* Formulario saliendo durante transición */}
                {userType === 'teacher' && !showForm && isTransitioning && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
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

              {/* Separador vertical */}
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
