// src/pages/student/StudentHome.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginApi } from "../../hooks/auth/useLoginApi";
import Header from "../../components/Header";
import PublishConsult from "./HistoryCard";
import AgendaCard from "./AgendaCard";
import PriceCard from "./PriceCard";
import SubjectList from "./SubjectList";
import FeaturedAdvisors from "./FeaturedAdvisors";
import KnowledgeCenter from "./KnowledgeCenter";
import WelcomeAlert from "../../components/WelcomeAlert";
import { Footer } from "../../components";

const StudentHome: React.FC = () => {
  const { user } = useLoginApi();
  const { logout } = useLoginApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "#FAF9F5", // 👈 Fondo principal soft-white
        minHeight: "100vh", // Asegura que cubra toda la altura visible
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <WelcomeAlert name={user?.first_name || "Student"} />

      {/* Contenido principal */}
      <div
        style={{
          flex: 1, // hace que el contenido principal se expanda
          padding: "7.5rem 2rem 2rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
        }}
      >
        <div>
          {/* 🔹 KnowledgeCenter */}
          <div style={{ marginBottom: "1.5rem" }}>
            <KnowledgeCenter />
          </div>

          {/* 🔹 Publicar consulta + Agenda */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <PublishConsult />
            <AgendaCard />
          </div>

          {/* 🔹 PriceCard y SubjectList */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <PriceCard />
            <SubjectList />
          </div>
        </div>

        {/* 🔹 Panel lateral */}
        <FeaturedAdvisors />
      </div>

      {/* Botón de cierre de sesión */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default StudentHome;
