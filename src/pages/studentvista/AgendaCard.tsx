import React from "react";
import { CalendarCheck } from "lucide-react"; // 🔹 Ícono más acorde con "reservas"
import { useNavigate } from "react-router-dom";

const ReservationCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        fontFamily: "Roboto, sans-serif",
      }}
      onClick={() => navigate("/reservas")} // 🔹 Nueva ruta
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)")
      }
    >
      {/* 🔹 Icono circular */}
      <div
        style={{
          backgroundColor: "#E6EEFF",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <CalendarCheck color="#3B82F6" size={24} />
      </div>

      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          color: "#1F2937",
        }}
      >
        Reservas
      </h3>

      <p
        style={{
          color: "#4B5563",
          marginBottom: "1rem",
          fontSize: "0.95rem",
        }}
      >
        Gestiona y consulta tus reservas de asesorías fácilmente.
      </p>

      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate("/reservas");
        }}
        style={{
          color: "#2563EB",
          fontWeight: 600,
          fontSize: "0.95rem",
        }}
      >
        Ver mis reservas →
      </span>
    </div>
  );
};

export default ReservationCard;
