// src/pages/studentvista/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../../context/auth/LoginContext";
import { useLoginApi } from "../../hooks/auth/useLoginApi"; // ✅ Importa el hook con la lógica
import Header from "../../components/Header";

const StudentHome: React.FC = () => {
  const { user } = useLoginContext(); // ✅ Solo las variables del contexto
  const { logout } = useLoginApi();   // ✅ La lógica de logout desde el hook
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Header fijo */}
      <Header />

      {/* Sección principal */}
      <main
        style={{
          padding: "7rem 2rem 2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <section
          style={{
            textAlign: "center",
            backgroundColor: "#f9fafb",
            borderRadius: "1rem",
            padding: "2.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h1 style={{ marginBottom: "1rem" }}>
            🎓 Bienvenido, {user?.first_name || "Student"}
          </h1>
          <p style={{ marginBottom: "2rem", color: "#555" }}>
            Has iniciado sesión como estudiante.
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#e74c3c",
              color: "#fff",
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
        </section>
      </main>
    </>
  );
};

export default StudentHome;
