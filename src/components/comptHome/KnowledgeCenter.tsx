import React, { useEffect, useState } from "react";

const KnowledgeCenter: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Activa las animaciones al montar el componente
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#E9F4FF",
        border: "1px solid #C9E2FF",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        fontFamily: "Roboto, sans-serif",
        textAlign: "left",
        color: "#1E293B",
        lineHeight: 1.6,
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        overflow: "hidden",
      }}
    >
      <h2
        className={`fade-slide-left ${visible ? "show" : ""}`}
        style={{
          margin: 0,
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "#1E293B",
        }}
      >
        ¿NECESITAS AYUDA CON TUS ESTUDIOS?
      </h2>

      <a
        href="#"
        className={`fade-slide-right ${visible ? "show" : ""}`}
        style={{
          display: "inline-block",
          marginTop: "0.3rem",
          fontSize: "1rem",
          fontWeight: "600",
          color: "#2563EB",
          textDecoration: "none",
          position: "relative",
          transition: "color 0.3s ease",
        }}
      >
        Centro de Asesorías Académicas
      </a>

      <p
        className={`fade-up ${visible ? "show" : ""}`}
        style={{
          marginTop: "0.4rem",
          fontSize: "0.95rem",
          color: "#475569",
          maxWidth: "600px",
        }}
      >
        Conecta con un docente dispuesto a guiarte y resolver tus dudas paso a paso.
      </p>

      {/* Animaciones con CSS */}
      <style>
        {`
          @keyframes slideLeft {
            from { opacity: 0; transform: translateX(-40px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideRight {
            from { opacity: 0; transform: translateX(40px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .fade-slide-left,
          .fade-slide-right,
          .fade-up {
            opacity: 0;
            transition: opacity 0.5s ease;
          }

          .fade-slide-left.show {
            animation: slideLeft 0.7s ease forwards;
          }

          .fade-slide-right.show {
            animation: slideRight 0.7s ease forwards;
            animation-delay: 0.2s;
          }

          .fade-up.show {
            animation: slideUp 0.8s ease forwards;
            animation-delay: 0.4s;
          }

          /* Hover suave en el enlace */
          .fade-slide-right.show:hover {
            color: #1E40AF;
          }
        `}
      </style>
    </div>
  );
};

export default KnowledgeCenter;
