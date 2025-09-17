import React from 'react';
import { Button } from '../../components';

const LoginForm: React.FC = () => {
  return (
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
  );
};

export default LoginForm;
