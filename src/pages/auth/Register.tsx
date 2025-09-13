import React from 'react';
import { Card } from '../../components';
import RegisterHeader from './RegisterHeader';
import RegisterForm from './RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <RegisterHeader />
        <RegisterForm />
        
        <p className="text-center text-sm text-petroleum-blue/70 mt-4">
          ¿Ya tienes cuenta? <a href="#" className="text-sky-blue hover:underline">Inicia sesión</a>
        </p>
      </Card>
    </div>
  );
};

export default Register;
