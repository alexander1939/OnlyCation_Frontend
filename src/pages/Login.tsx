import React from 'react';
import { Button, Card } from '../components';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-petroleum-blue mb-2">Iniciar Sesión</h2>
          <p className="text-petroleum-blue/70">Accede a tu cuenta OnlyCation</p>
        </div>
        
        <form className="space-y-4">
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
            Iniciar Sesión
          </Button>
        </form>
        
        <p className="text-center text-sm text-petroleum-blue/70 mt-4">
          ¿No tienes cuenta? <a href="#" className="text-sky-blue hover:underline">Regístrate</a>
        </p>
      </Card>
    </div>
  );
};

export default Login;
