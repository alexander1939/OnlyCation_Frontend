import React from 'react';
import { Button, Card } from '../components';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-petroleum-blue mb-2">Crear Cuenta</h2>
          <p className="text-petroleum-blue/70">Únete a la comunidad OnlyCation</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-petroleum-blue mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petroleum-blue"
              placeholder="Tu nombre completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-petroleum-blue mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petroleum-blue"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-petroleum-blue mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-petroleum-blue"
              placeholder="••••••••"
            />
          </div>
          
          <Button variant="primary" size="md" className="w-full">
            Crear Cuenta
          </Button>
        </form>
        
        <p className="text-center text-sm text-petroleum-blue/70 mt-4">
          ¿Ya tienes cuenta? <a href="#" className="text-sky-blue hover:underline">Inicia sesión</a>
        </p>
      </Card>
    </div>
  );
};

export default Register;
