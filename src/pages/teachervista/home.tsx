import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../../context/auth/LoginContext";
import { useLoginApi } from "../../hooks/auth/useLoginApi"; // ✅ importar el hook con la lógica
import Header from "../../components/Header";

const TeacherHome: React.FC = () => {
  const { user } = useLoginContext(); // ✅ solo variables del contexto
  const { logout } = useLoginApi();   // ✅ lógica del logout desde el hook
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Header siempre arriba */}
      <Header />

      {/* Contenido de la página */}
      <div style={{ padding: "6rem 2rem 2rem", textAlign: "center" }}>
        <h1>Bienvenido, {user?.first_name || "Teacher"} 👨‍🏫</h1>
        <p>Has iniciado sesión como docente.</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "2rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background 0.3s ease",
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
