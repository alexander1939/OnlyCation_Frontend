// src/pages/student/StudentHome.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import PublishConsult from "../../components/comptHome/HistoryCard";
import AgendaCard from "../../components/comptHome/AgendaCard";
import PriceCard from "../../components/comptHome/PriceCard";
import SubjectList from "../../components/comptHome/SubjectList";
import FeaturedAdvisors from "../../components/comptHome/FeaturedAdvisors";
import KnowledgeCenter from "../../components/comptHome/KnowledgeCenter";
import { Footer } from "../../components";
import { useLoginApi } from "../../hooks/auth/useLoginApi";
import WelcomeAlert from "../../components/WelcomeAlert";

const StudentHome: React.FC = () => {
  const { user } = useLoginApi();
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#FAF9F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "0", // sin padding extra en el contenedor principal
      }}
    >
      <Header />
      <WelcomeAlert name={user?.first_name || "Student"} />

      {/* Contenido principal con padding simétrico */}
      <div
        style={{
          flex: 1,
          padding: "7.5rem 2rem 2rem 2rem", // 🔹 mismo espacio a izquierda y derecha
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

      <Footer />
    </div>
  );
};

export default StudentHome;
