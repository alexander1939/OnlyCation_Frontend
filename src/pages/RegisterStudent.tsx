import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacy_policy_accepted: boolean;
}

export default function RegisterStudent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  // Placeholder local function mientras no hay contexto de auth
  const registerStudent = async (_data: Omit<RegisterFormData, 'confirmPassword'>) => {
    // TODO: conectar a API real de registro de estudiante
    await new Promise((r) => setTimeout(r, 400));
    return { success: true } as const;
  };

  const handleSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar datos para el backend (sin confirmPassword)
      const { confirmPassword, ...registerData } = formData;
      
      const response = await registerStudent(registerData);
      
      if (response.success) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/', { 
            state: { 
              message: 'Registro exitoso. Ya puedes iniciar sesión.',
              email: formData.email 
            }
          });
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario');
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
                  Serás redirigido al inicio de sesión en unos segundos...
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
          userType="student" 
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
          
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            marginTop: '16px',
            fontFamily: 'Inter, sans-serif'
          }}>
            ¿Eres docente?{' '}
            <button
              onClick={() => navigate('/register/teacher')}
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
              Regístrate como docente
            </button>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
