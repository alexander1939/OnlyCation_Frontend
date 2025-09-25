import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mb-6">
      <h2 className="text-3xl font-bold text-petroleum-blue mb-2 text-center">
        Bienvenido a OnlyCation
      </h2>
      <p className="text-petroleum-blue/70 text-center">
        Ingresa a tu cuenta para continuar
      </p>
    </div>
  );
};

export default LoginHeader;