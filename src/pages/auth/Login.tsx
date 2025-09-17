import React from 'react';
import { Card } from '../../components';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <LoginHeader />
        <LoginForm />
        
        <p className="text-center text-sm text-petroleum-blue/70 mt-4">
          ¿No tienes cuenta? <a href="#" className="text-sky-blue hover:underline">Regístrate</a>
        </p>
      </Card>
    </div>
  );
};

export default Login;
