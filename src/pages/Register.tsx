import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import { authService } from '../services/authService';

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

type UserType = 'student' | 'teacher';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, rfc, expertise_area, certificate, curriculum, ...registerData } = formData;
      
      let response;
      if (userType === 'student') {
        response = await authService.registerStudent(registerData);
      } else {
        response = await authService.registerTeacher(registerData);
      }
      
      if (response.success) {
        setRegisteredUser(response.data);
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
      <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5'}}>
        <Header />
        <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '48px 32px',
              boxShadow: '0 12px 40px rgba(41, 73, 84, 0.08)',
              border: '2px solid #10B981'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '36px'
              }}>
                ✅
              </div>
              
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#294954',
                marginBottom: '16px',
                fontFamily: 'Inter, sans-serif'
              }}>
                ¡Registro Exitoso!
              </h1>
              
              <p style={{
                fontSize: '18px',
                color: '#6B7280',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Tu cuenta de estudiante ha sido creada exitosamente. 
                Ya puedes acceder a todos nuestros tutores especializados.
              </p>
              
              <div style={{
                padding: '16px',
                backgroundColor: '#F0F9FF',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#1E40AF',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Serás redirigido al inicio en unos segundos...
                </p>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#68B2C9',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5A9FB8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#68B2C9';
                }}
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
      <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5'}}>
        <Header />
        <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '48px 32px',
              boxShadow: '0 12px 40px rgba(41, 73, 84, 0.08)',
              border: '2px solid #F59E0B'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#8ED4BE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '36px'
              }}>
                ✅
              </div>
              
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#294954',
                marginBottom: '16px',
                fontFamily: 'Inter, sans-serif'
              }}>
                ¡Cuenta Creada!
              </h1>
              
              <p style={{
                fontSize: '18px',
                color: '#6B7280',
                lineHeight: '1.6',
                marginBottom: '32px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Hola <strong>{registeredUser?.first_name}</strong>, tu cuenta de docente ha sido 
                creada exitosamente en estado <strong>pendiente</strong>.
              </p>
              
              <div style={{
                backgroundColor: '#F0F9FF',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1E40AF',
                  marginBottom: '16px',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👨‍🏫 Estado de tu Cuenta
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#FFFFFF',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: '#059669',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Cuenta creada exitosamente en estado pendiente
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#FFFFFF',
                      fontWeight: 'bold'
                    }}>
                      ⏳
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: '#92400E',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      No se enviaron documentos (proceso opcional)
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#EBF8FF',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1E40AF',
                  marginBottom: '12px',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📋 Proceso de Verificación (Opcional)
                </h4>
                <ul style={{
                  fontSize: '14px',
                  color: '#1E40AF',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: 0,
                  paddingLeft: '20px',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <li>Puedes iniciar sesión inmediatamente con tu cuenta pendiente</li>
                  <li>Para dar clases, deberás completar el proceso de verificación</li>
                  <li>Consulta el apartado <strong>Documentación/Activación</strong> en tu perfil</li>
                  <li>Sube tus documentos cuando decidas activar tu cuenta</li>
                </ul>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: '2px solid #68B2C9',
                    backgroundColor: 'transparent',
                    color: '#68B2C9',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#68B2C9';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#68B2C9';
                  }}
                >
                  Volver al Inicio
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#8ED4BE',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7BC7AD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8ED4BE';
                  }}
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

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5'}}>
      <Header />
      
      <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
        {/* Selector de tipo de usuario */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 40px',
          padding: '0 20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 4px 20px rgba(41, 73, 84, 0.06)',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setUserType('student')}
              style={{
                flex: 1,
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: userType === 'student' ? '#68B2C9' : 'transparent',
                color: userType === 'student' ? '#FFFFFF' : '#6B7280',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              🎓 Soy Estudiante
            </button>
            
            <button
              onClick={() => setUserType('teacher')}
              style={{
                flex: 1,
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: userType === 'teacher' ? '#8ED4BE' : 'transparent',
                color: userType === 'teacher' ? '#FFFFFF' : '#6B7280',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              👨‍🏫 Soy Docente
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 20px',
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
        
        {/* Formulario de registro */}
        <RegisterForm 
          userType={userType}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        
        {/* Enlaces adicionales */}
        <div style={{
          maxWidth: '600px',
          margin: '40px auto 0',
          textAlign: 'center',
          padding: '0 20px'
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
                color: userType === 'student' ? '#68B2C9' : '#8ED4BE',
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
