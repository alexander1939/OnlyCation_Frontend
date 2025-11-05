// src/components/comptHome/UpcomingSessions.tsx
import React from "react";
import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Session {
  title: string;
  date: string;
  studentName: string;
}

interface UpcomingSessionsProps {
  title: string;
  sessions: Session[];
  backgroundColor?: string;
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({
  title,
  sessions,
  backgroundColor = "#fff",
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: "0.75rem",
        padding: "0.8rem", // 👈 reducimos padding general
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        fontFamily: "'Roboto', sans-serif",
        width: "100%",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <h3
        style={{
          fontWeight: 600,
          color: "#1e3a3a",
          marginBottom: "0.8rem", // 👈 reducimos margen inferior
          fontSize: "1rem", // 👈 un poquito más pequeño
        }}
      >
        {title}
      </h3>

      {sessions.length === 0 ? (
        <p style={{ color: "#6B7280", fontSize: "0.9rem" }}>
          No tienes sesiones próximas.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "0.75rem", // 👈 reducimos espacio entre tarjetas
          }}
        >
          {sessions.map((session, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#F8FAFC",
                padding: "0.6rem 0.8rem", // 👈 mucho más compacto
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem", // 👈 reducimos gap entre icono y texto
              }}
              onClick={() => navigate("/agenda")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#EEF7F5";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Clock size={18} color="#3B82F6" />
              <div>
                <p
                  style={{
                    fontWeight: 500,
                    margin: 0,
                    fontSize: "0.9rem", // 👈 texto un poco más pequeño
                    color: "#1e3a3a",
                  }}
                >
                  {session.title}
                </p>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "0.8rem",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {session.date} • <User size={12} /> {session.studentName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
