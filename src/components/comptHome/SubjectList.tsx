import React from "react";
import { GraduationCap, BookOpen, LibraryBig, Tag } from "lucide-react";
import PriceCard from "./PriceCard";

interface SubjectListProps {
  role?: "student" | "teacher"; // 👈 definimos el tipo de usuario
  onPriceClick?: () => void; // handler para navegar a precios (definido por el padre)
}

const levels = [
  { name: "Media Superior", icon: GraduationCap },
  { name: "Superior", icon: BookOpen },
  { name: "Posgrado", icon: LibraryBig },
];

const SubjectList: React.FC<SubjectListProps> = ({ role = "student", onPriceClick }) => {
  // Si es teacher, renderiza la tarjeta de precios
  if (role === "teacher") {
    return (
      <PriceCard
        title="Precios"
        description="Establece y ajusta las tarifas de tus servicios de asesoría y clases."
        linkText="Definir precios"
        route="/profile/price"
        icon={Tag}
        iconColor="#9333ea"
        iconBg="#f3e8ff"
      />
    );
  }

  // 👇 Si es student, muestra los niveles educativos
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        fontFamily: "'Roboto', sans-serif",
        width: "100%",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <h3
        style={{
          fontWeight: 600,
          color: "#1e3a3a",
          marginBottom: "1rem",
          fontSize: "1.1rem",
        }}
      >
        Explorar Niveles Educativos
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "1rem",
          flexWrap: "nowrap",
        }}
      >
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <div
              key={level.name}
              style={{
                flex: "1 1 0",
                backgroundColor: "#f8fafc",
                borderRadius: "0.75rem",
                padding: "1rem",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget.style.backgroundColor = "#eef7f5"),
                (e.currentTarget.style.transform = "scale(1.03)"))
              }
              onMouseLeave={(e) =>
                ((e.currentTarget.style.backgroundColor = "#f8fafc"),
                (e.currentTarget.style.transform = "scale(1)"))
              }
            >
              <Icon
                size={26}
                color="#1e3a3a"
                style={{ marginBottom: "0.4rem" }}
              />
              <p
                style={{
                  fontWeight: 500,
                  color: "#1e3a3a",
                  margin: 0,
                  fontSize: "0.95rem",
                }}
              >
                {level.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectList;
