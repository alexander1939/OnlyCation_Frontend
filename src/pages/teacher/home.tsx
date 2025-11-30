// src/pages/teacher/TeacherHome.tsx
import React, { useEffect, useState } from "react";
import { useLoginContext } from "../../context/auth";
import { useWallet } from "../../context/wallet/WalletContext";
import WelcomeAlert from "../../components/WelcomeAlert";
import Header from "../../components/ui/Header";
import KnowledgeCenter from "../../components/comptHome/KnowledgeCenter";
import DashboardCard from "../../components/comptHome/HistoryCard";
import GeneralCard from "../../components/comptHome/GeneralCard";
import AdaptiveList from "../../components/comptHome/SubjectList";
import ChatCard from "../../components/comptHome/ChatCard";
import { CreditCard, FileText, CalendarCheck, MessageSquare } from "lucide-react";
import TeacherStatus from "../../components/comptHome/TeacherStatus";
import "../../styles/teacher-home.css";
import Footer from "../../components/ui/Footer";
import LoadingOverlay from "../../components/shared/LoadingOverlay";

const TeacherHome: React.FC = () => {
  const { user } = useLoginContext();
  const { fetchWalletBalance, loading: walletLoading, creating: walletCreating } = useWallet();
  const [showWelcome, setShowWelcome] = useState(false);
  

  useEffect(() => {
    try {
      const shouldShow = sessionStorage.getItem("showWelcome") === "1";
      if (shouldShow) {
        setShowWelcome(true);
        sessionStorage.removeItem("showWelcome");
      }
    } catch {}
  }, []);

  return (
    <>
      <Header />
      {showWelcome && (
        <WelcomeAlert name={user?.first_name || "Teacher"} />
      )}

      <div style={{ 
        padding: "7.5rem clamp(12px, 4vw, 2rem) 2rem",
        maxWidth: "min(1200px, 96vw)",
        margin: "0 auto"
      }}>
        {/* Contenedor superior: KnowledgeCenter + UpcomingSessions */}
        <div
          style={{
            display: "flex",
            gap: "clamp(12px, 2vw, 0.75rem)",
            flexWrap: "wrap",
            marginBottom: "2rem",
            alignItems: "stretch",
            justifyContent: "center"
          }}
        >
          {/* KnowledgeCenter */}
          <div className="top-col" style={{ flex: 2, minWidth: "300px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex" }}> {/* 👈 contenedor extra para estirar */}
              <KnowledgeCenter
                title="¿QUIERES APOYAR A TUS ESTUDIANTES?"
                linkText="Accede a tus Asesorías"
                linkHref="#"
                description="Administra tus sesiones, responde consultas y guía el aprendizaje de tus alumnos."
                backgroundColor="#FFF8E5"
              />
            </div>
          </div>

          {/* Chat docente */}
          <div className="top-col" style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex" }}> {/* 👈 contenedor extra para estirar */}
              <ChatCard
                title="Chat con estudiantes"
                description="Inicia, continúa y gestiona tus conversaciones con estudiantes."
                linkText="Ir al chat"
                route="/teacher/chat"
                icon={MessageSquare}
                iconColor="#3B82F6"
                iconBg="#E6EEFF"
              />
            </div>
          </div>

          {/* TeacherStatus */}
          <div className="top-col" style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column" }}>
            <div
              style={{ flex: 1, display: "flex", transition: "transform 0.2s ease, box-shadow 0.2s ease", borderRadius: "1rem" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
              }}
            >
              <TeacherStatus />
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="teacher-grid" style={{ marginBottom: "2rem" }}>
          <div style={{ height: "100%" }}>
            <GeneralCard
              title="Actualizar Datos"
              description="Configura opciones generales de tu perfil y cuenta."
              linkText="Ir a datos"
              route="/teacher/personal-data"
            />
          </div>
          
          <div style={{ height: "100%" }}>
            <DashboardCard
              title="Documentos"
              description="Consulta y administra tus documentos y archivos importantes."
              linkText="Ver documentos"
              route="/teacher/documents"
              icon={FileText}
              iconColor="#F59E0B"
              iconBg="#FEF3C7"
            />
          </div>
          <div style={{ height: "100%" }}>
            <DashboardCard
              title="Personalizar Agenda"
              description="Crea y organiza tu agenda de asesorías y clases fácilmente."
              linkText="Crear agenda"
              route="/teacher/availability"
              icon={CalendarCheck}
              iconColor="#3B82F6"
              iconBg="#E6EEFF"
            />
          </div>
          <div style={{ height: "100%" }}>
            <div 
              onClick={async (e) => {
                e.preventDefault();
                await fetchWalletBalance();
              }}
              style={{ height: '100%', cursor: 'pointer' }}
            >
              <DashboardCard
                title="Cartera"
                description="Consulta tus pagos y transacciones recientes."
                linkText="Ver mi cartera"
                route="#"
                icon={CreditCard}
                iconColor="#16A34A"
                iconBg="#DCFCE7"
              />
            </div>
          </div>
          <div style={{ height: "100%" }}>
            <AdaptiveList role="teacher" />
          </div>
        </div>

      </div>
      <Footer />
      <LoadingOverlay
        open={Boolean(walletLoading || walletCreating)}
        message="Preparando tu experiencia..."
        logoSrc="/logo.png"
        gifSrc="/icons8-rhombus-loader-96.gif"
      />
    </>
  );
};

export default TeacherHome;
