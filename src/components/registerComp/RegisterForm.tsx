import React, { useState } from 'react';
import Ribbon from '../ui/Ribbon';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacy_policy_accepted: boolean;
  // Campos específicos para docentes
  rfc?: string;
  expertise_area?: string;
  certificate?: File | null;
  curriculum?: File | null;
}

interface RegisterFormProps {
  userType: 'student' | 'teacher';
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ userType, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacy_policy_accepted: false,
    rfc: '',
    expertise_area: '',
    certificate: null,
    curriculum: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData | 'confirmPassword', string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones que coinciden con el backend
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
    if (!/[a-z]/.test(password)) errors.push('Al menos una minúscula');
    if (!/[0-9]/.test(password)) errors.push('Al menos un número');
    if (!/[\W_]/.test(password)) errors.push('Al menos un carácter especial');
    return errors;
  };

  const validateName = (name: string, field: string): string | null => {
    if (name.length < 3) return `${field} debe tener al menos 3 caracteres`;
    if (name.length > 25) return `${field} debe tener menos de 25 caracteres`;
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData | 'confirmPassword', string>> = {};

    // Validar nombres
    const firstNameError = validateName(formData.first_name, 'Nombre');
    if (firstNameError) newErrors.first_name = firstNameError;

    const lastNameError = validateName(formData.last_name, 'Apellido');
    if (lastNameError) newErrors.last_name = lastNameError;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors.join(', ');
    }

    // Confirmar contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Política de privacidad
    if (!formData.privacy_policy_accepted) {
      newErrors.privacy_policy_accepted = 'Debes aceptar la política de privacidad';
    }

    // Los docentes no necesitan validaciones adicionales en el registro inicial
    // Su perfil quedará en estado pending hasta que completen la verificación

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };


  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '16px',
    border: '2px solid #E5E7EB',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.3s ease',
    backgroundColor: '#FFFFFF',
  };


  const errorInputStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#EF4444',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Ribbon 
          text={userType === 'student' ? 'Registro de Estudiante' : 'Registro de Docente'} 
          backgroundColor={userType === 'student' ? '#68B2C9' : '#8ED4BE'}
        />
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#294954',
          marginTop: '20px',
          marginBottom: '16px',
          fontFamily: 'Inter, sans-serif'
        }}>
          {userType === 'student' ? 'Únete como Estudiante' : 'Únete como Docente'}
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6B7280',
          lineHeight: '1.6',
          fontFamily: 'Inter, sans-serif'
        }}>
          {userType === 'student' 
            ? 'Accede inmediatamente a miles de tutores especializados'
            : 'Comparte tu conocimiento y ayuda a estudiantes a alcanzar sus metas'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Nombres */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#294954',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Nombre *
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              style={errors.first_name ? errorInputStyle : inputStyle}
              placeholder="Tu nombre"
              required
            />
            {errors.first_name && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.first_name}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#294954',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Apellido *
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              style={errors.last_name ? errorInputStyle : inputStyle}
              placeholder="Tu apellido"
              required
            />
            {errors.last_name && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#294954',
            marginBottom: '8px',
            fontFamily: 'Inter, sans-serif'
          }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={errors.email ? errorInputStyle : inputStyle}
            placeholder="tu@email.com"
            required
          />
          {errors.email && (
            <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Contraseñas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#294954',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                style={errors.password ? errorInputStyle : inputStyle}
                placeholder="Contraseña segura"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#294954',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Confirmar Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                style={errors.confirmPassword ? errorInputStyle : inputStyle}
                placeholder="Repite tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Información para docentes */}
        {userType === 'teacher' && (
          <div style={{
            padding: '24px',
            backgroundColor: '#F0F9FF',
            borderRadius: '16px',
            border: '2px solid #8ED4BE',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>👨‍🏫</span>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#294954',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Registro como Docente
              </h3>
            </div>
            
            <p style={{
              fontSize: '16px',
              color: '#1E40AF',
              lineHeight: '1.6',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Tu cuenta será creada en estado <strong>pendiente</strong>. Si deseas activar tu cuenta 
              para dar clases, podrás realizar el proceso de validación después de cumplir con los 
              requisitos de documentación. Para más información, consulta el apartado de{' '}
              <strong>Documentación/Activación</strong> en tu perfil.
            </p>
          </div>
        )}

        {/* Política de privacidad */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            type="checkbox"
            id="privacy_policy"
            checked={formData.privacy_policy_accepted}
            onChange={(e) => handleInputChange('privacy_policy_accepted', e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              marginTop: '2px',
              accentColor: '#68B2C9'
            }}
            required
          />
          <label htmlFor="privacy_policy" style={{
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.5',
            fontFamily: 'Inter, sans-serif'
          }}>
            Acepto la <a href="#" style={{ color: '#68B2C9', textDecoration: 'underline' }}>
              política de privacidad
            </a> y los <a href="#" style={{ color: '#68B2C9', textDecoration: 'underline' }}>
              términos de servicio
            </a> de OnlyCation *
          </label>
        </div>
        {errors.privacy_policy_accepted && (
          <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '-16px' }}>
            {errors.privacy_policy_accepted}
          </p>
        )}

        {/* Botón de registro */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: isLoading ? '#9CA3AF' : (userType === 'student' ? '#68B2C9' : '#8ED4BE'),
            color: '#FFFFFF',
            boxShadow: isLoading ? 'none' : '0 4px 16px rgba(104, 178, 201, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(104, 178, 201, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(104, 178, 201, 0.3)';
            }
          }}
        >
          {isLoading ? 'Registrando...' : 
           userType === 'student' ? 'Crear Cuenta de Estudiante' : 'Crear Cuenta de Docente'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
