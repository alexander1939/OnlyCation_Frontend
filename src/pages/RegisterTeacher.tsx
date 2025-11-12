import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import RegisterForm from '../components/registerComp/RegisterForm';

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

export default function RegisterTeacher() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const navigate = useNavigate();
  // Placeholder local function while auth context is removed
  const registerTeacher = async (_data: Omit<RegisterFormData, 'confirmPassword' | 'rfc' | 'expertise_area' | 'certificate' | 'curriculum'>) => {
    // TODO: conectar a API real
    await new Promise((r) => setTimeout(r, 400));
    return { success: true } as const;
  };

  const handleSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Paso 1: Registrar usuario básico
      const { confirmPassword, rfc, expertise_area, certificate, curriculum, ...registerData } = formData;
      
      const response = await registerTeacher(registerData);
      
      if (response.success) {
        setRegisteredUser({ email: registerData.email, first_name: registerData.first_name, last_name: registerData.last_name });
        
        // Paso 2: Si hay documentos, subirlos (esto requeriría login primero)
        // Por ahora, solo mostramos éxito con información sobre el proceso
        setSuccess(true);
        
        // Nota: En una implementación completa, podrías:
        // 1. Hacer login automático después del registro
        // 2. Subir los documentos usando uploadTeacherDocuments
        // 3. Mostrar progreso de cada paso
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar docente');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
                backgroundColor: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '36px'
              }}>
                ⏳
              </div>
              
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#294954',
                marginBottom: '16px',
                fontFamily: 'Inter, sans-serif'
              }}>
                ¡Registro Enviado!
              </h1>
              
              <p style={{
                fontSize: '18px',
                color: '#6B7280',
                lineHeight: '1.6',
                marginBottom: '32px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Hola <strong>{registeredUser?.first_name}</strong>, tu solicitud para ser docente 
                ha sido enviada exitosamente.
              </p>
              
              {/* Proceso de aprobación */}
              <div style={{
                backgroundColor: '#FEF3C7',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#92400E',
                  marginBottom: '16px',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📋 Proceso de Aprobación
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { step: 1, text: 'Registro inicial completado', status: 'completed' },
                    { step: 2, text: 'Revisión de documentos por nuestro equipo', status: 'pending' },
                    { step: 3, text: 'Verificación de credenciales académicas', status: 'pending' },
                    { step: 4, text: 'Aprobación final y activación de cuenta', status: 'pending' }
                  ].map((item) => (
                    <div key={item.step} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 0'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: item.status === 'completed' ? '#10B981' : '#D1D5DB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                      }}>
                        {item.status === 'completed' ? '✓' : item.step}
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: item.status === 'completed' ? '#059669' : '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Información importante */}
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
                  📧 Próximos Pasos
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
                  <li>Recibirás un email de confirmación en <strong>{registeredUser?.email}</strong></li>
                  <li>El proceso de revisión toma entre 24-48 horas hábiles</li>
                  <li>Te notificaremos por email cuando tu cuenta sea aprobada</li>
                  <li>Podrás completar tu perfil y comenzar a enseñar</li>
                </ul>
              </div>
              
              {/* Botones de acción */}
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
        
        <RegisterForm 
          userType="teacher" 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        
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
                color: '#8ED4BE',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Inicia sesión aquí
            </button>
          </p>
          
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            marginTop: '16px',
            fontFamily: 'Inter, sans-serif'
          }}>
            ¿Eres estudiante?{' '}
            <button
              onClick={() => navigate('/register/student')}
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
              Regístrate como estudiante
            </button>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
