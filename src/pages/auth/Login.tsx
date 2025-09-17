import React, { useState } from 'react';
import { useAuthContext } from '../../context/Auth/AuthContext';
import { Card } from '../../components';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, isLoading } = useAuthContext(); // Ya no necesitamos `user` aquí
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setError(''); // Limpiar error previo
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'No se pudo iniciar sesión');
    } else {
      // Redirige según el rol que viene del resultado del login
      const role = result.role; // role viene del hook useAuth
      if (role === 'teacher' || role === 'student') {
        navigate('/home-rol');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <LoginHeader />
        <LoginForm onSubmit={handleLogin} />

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {!isLoading && !error && (
          <p className="text-center text-gray-500 mt-2">
            Ingresa tus credenciales para iniciar sesión
          </p>
        )}

        <p className="text-center text-sm text-petroleum-blue/70 mt-4">
          ¿No tienes cuenta?{' '}
          <a href="#" className="text-sky-blue hover:underline">
            Regístrate
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Login;
