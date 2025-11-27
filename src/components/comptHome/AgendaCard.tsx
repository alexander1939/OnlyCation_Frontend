import React from "react";
import { useNavigate } from "react-router-dom";

interface InfoCardProps {
  title: string;
  description: string;
  linkText: string;
  route: string;
  icon: React.FC<{ size?: number; color?: string }>;
  iconColor?: string;
  iconBg?: string;
  backgroundColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  linkText,
  route,
  icon: Icon,
  iconColor = "#3B82F6",
  iconBg = "#E6EEFF",
  backgroundColor = "white",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="info-card"
      style={{
        backgroundColor,
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        fontFamily: "Roboto, sans-serif",
      }}
      onClick={() => navigate(route)}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)")
      }
    >
      {/* 🔹 Ícono circular */}
      <div
        style={{
          backgroundColor: iconBg,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Icon color={iconColor} size={24} />
      </div>

      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          color: "#1F2937",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#4B5563",
          marginBottom: "1rem",
          fontSize: "0.95rem",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate(route);
        }}
        style={{
          color: "#2563EB",
          fontWeight: 600,
          fontSize: "0.95rem",
        }}
      >
        {linkText} →
      </span>

      {/* 🔹 Responsividad */}
      <style>{`
        @media (max-width: 768px) {
          .info-card { padding: 1.2rem !important; }
          .info-card h3 { font-size: 1rem !important; }
          .info-card p, .info-card span { font-size: 0.9rem !important; }
        }
      `}</style>
    </div>
  );
};

export default InfoCard;
