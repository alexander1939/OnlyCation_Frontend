import React from "react";
import { useLoginContext } from "../../context/auth";
import WelcomeAlert from "../../components/WelcomeAlert"; 
import Header from "../../components/ui/Header";

const TeacherHome: React.FC = () => {
  const { user } = useLoginContext();

  return (
    <>
      {/* Header superior */}
      <Header />

      {/* 👋 Alerta temporal de bienvenida */}
      <WelcomeAlert name={user?.first_name || "Teacher"} />

      {/* Contenido principal */}
      <div style={{ padding: "6rem 2rem 2rem", textAlign: "center" }}>
        {/* Aquí ya no hay botón de cerrar sesión */}
      </div>
    </>
  );
};

export default TeacherHome;
