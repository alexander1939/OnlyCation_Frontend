// src/pages/teacher/TeacherHome.tsx
import React from "react";
import { useLoginContext } from "../../context/auth";
import WelcomeAlert from "../../components/WelcomeAlert";
import Header from "../../components/ui/Header";
import KnowledgeCenter from "../../components/comptHome/KnowledgeCenter";
import DashboardCard from "../../components/comptHome/HistoryCard";
import PriceCard from "../../components/comptHome/PriceCard";
import GeneralCard from "../../components/comptHome/GeneralCard";
import AdaptiveList from "../../components/comptHome/SubjectList";
import UpcomingSessions from "../../components/comptHome/NextSession";
import { CreditCard, FileText, CalendarCheck, CheckCircle } from "lucide-react";
import TeacherStatus from "../../components/comptHome/TeacherStatus";
import "../../styles/teacher-home.css";
import Footer from "../../components/ui/Footer";
import { useNavigate } from "react-router-dom";

const TeacherHome: React.FC = () => {
  const { user } = useLoginContext();
  const navigate = useNavigate();

  const upcomingSessions = [
    {
      title: "Clase de Matemáticas",
      date: "2 Nov, 10:00 AM",
      studentName: "Juan Pérez",
    },
    {
      title: "Asesoría Física",
      date: "3 Nov, 2:00 PM",
      studentName: "María López",
    },
    {
      title: "Química Avanzada",
      date: "4 Nov, 11:00 AM",
      studentName: "Carlos Ruiz",
    },
  ];

  return (
    <>
      <Header />
      <WelcomeAlert name={user?.first_name || "Teacher"} />

      <div style={{ padding: "7.5rem 2rem 2rem" }}>
        {/* Contenedor superior: KnowledgeCenter + UpcomingSessions */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
            alignItems: "stretch", // 👈 estira ambos al mismo alto
          }}
        >
          {/* KnowledgeCenter */}
          <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column" }}>
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

          {/* UpcomingSessions */}
          <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex" }}> {/* 👈 contenedor extra para estirar */}
              <UpcomingSessions
                title="Próximas Sesiones"
                sessions={upcomingSessions}
              />
            </div>
          </div>

          {/* TeacherStatus compacto: columna angosta fija */}
          <div style={{ flex: "0 0 280px", maxWidth: "280px", minWidth: "260px", display: "flex", flexDirection: "column" }}>
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
            <PriceCard
              title="Confirmación de Asesoría"
              description="Verifica los datos y confirma tu próxima sesión personalizada."
              linkText="Confirmar asesoría"
              route="/confirmacion"
              icon={CheckCircle}
              iconColor="#16A34A"
              iconBg="#E6FFFA"
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
            <DashboardCard
              title="Cartera"
              description="Consulta tus pagos y transacciones recientes."
              linkText="Ver mi cartera"
              route="/pagos"
              icon={CreditCard}
              iconColor="#16A34A"
              iconBg="#DCFCE7"
            />
          </div>
          <div style={{ height: "100%" }}>
            <AdaptiveList role="teacher" onPriceClick={() => navigate('/profile/price')} />
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default TeacherHome;
