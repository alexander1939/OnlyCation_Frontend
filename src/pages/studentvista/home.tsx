import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../../context/auth";
import { useLoginApi } from "../../hooks/auth/useLoginApi";
import Header from "../../components/ui/Header";
import WelcomeAlert from "../../components/WelcomeAlert"; // 👈 Importamos la alerta

const StudentHome: React.FC = () => {
  const { user } = useLoginContext();
  const { logout } = useLoginApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Header fijo */}
      <Header />

      {/* 👋 Alerta de bienvenida */}
      {user?.first_name && <WelcomeAlert name={user.first_name} />}

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
