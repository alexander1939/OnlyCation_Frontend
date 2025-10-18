import React from "react";
import Ribbon from "../../components/Ribbon"; // Ajusta la ruta según tu estructura

const LoginHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mb-6">
      <h2 className="text-3xl font-bold text-petroleum-blue mb-2 text-center">
        Bienvenido a OnlyCation
      </h2>
      
      {/* Aquí usamos el componente Ribbon */}
      <Ribbon
        text="Ingresa a tu cuenta para continuar"
        backgroundColor="#FFDE97"   // Puedes cambiar el color del ribbon
        textColor="black"           // Color del texto
        fontSize="14px"             // Tamaño del texto
        padding="6px 18px"          // Espaciado interno
        className="mt-2"
        ariaLabel="Mensaje de inicio de sesión"
      />
    </div>
  );
};

export default LoginHeader;
