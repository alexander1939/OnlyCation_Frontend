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
import { CalendarCheck, History, CheckCircle, GraduationCap, 
BookOpen, Library
} from "lucide-react";


const levels = [
  { name: "Media Superior", icon: GraduationCap },
  { name: "Superior", icon: BookOpen },
  { name: "Posgrado", icon: Library },
];

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
            <KnowledgeCenter
              title="¿NECESITAS AYUDA CON TUS ESTUDIOS?"
              linkText="Centro de Asesorías Académicas"
              description="Conecta con un docente dispuesto a guiarte y resolver tus dudas paso a paso."
            />
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
            <PublishConsult
              title="Historia de Clases"
              description="Revisa tus clases pasadas y el material de estudio."
              linkText="Ver historial"
              route="/historial"
              icon={History}
              iconColor="#22C55E"
              iconBg="#E6F4EA"
            />

            <AgendaCard
              title="Reservas"
              description="Gestiona tus próximas asesorías o clases programadas."
              linkText="Ver reservas"
              route="/reservas"
              icon={CalendarCheck}
            />
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
            <PriceCard
              title="Confirmación de Asesoría"
              description="Verifica los datos y confirma tu próxima sesión personalizada."
              linkText="Confirmar asesoría"
              route="/confirmacion"
              icon={CheckCircle}
              iconColor="#16A34A"
              iconBg="#E6FFFA"
            />
            <SubjectList 
            title="Explorar Niveles Educativos" options={levels} mode="student"
            />
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
