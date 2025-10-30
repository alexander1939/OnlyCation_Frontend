import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../../context/auth";
import { useLoginApi } from "../../hooks/auth/useLoginApi";
import WelcomeAlert from "../../components/WelcomeAlert"; 
import Header from "../../components/ui/Header";


const TeacherHome: React.FC = () => {
  const { user } = useLoginContext();
  const { logout } = useLoginApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Header superior */}
      <Header />

      {/* 👋 Alerta temporal de bienvenida */}
      <WelcomeAlert name={user?.first_name || "Teacher"} />

      {/* Contenido principal */}
      <div style={{ padding: "6rem 2rem 2rem", textAlign: "center" }}>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "2rem",
            padding: "0.7rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background 0.3s ease",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#c0392b")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#e74c3c")
          }
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default TeacherHome;
