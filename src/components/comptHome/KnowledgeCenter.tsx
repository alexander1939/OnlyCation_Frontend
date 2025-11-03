import React, { useEffect, useState } from "react";

interface KnowledgeCenterProps {
  title: string;
  linkText: string;
  linkHref?: string;
  description: string;
  backgroundColor?: string;
}

const KnowledgeCenter: React.FC<KnowledgeCenterProps> = ({
  title,
  linkText,
  linkHref = "#",
  description,
  backgroundColor = "#E9F4FF",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      style={{
        backgroundColor,
        border: "1px solid #C9E2FF",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        fontFamily: "Roboto, sans-serif",
        textAlign: "left",
        color: "#1E293B",
        lineHeight: 1.6,
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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
        {title}
      </h2>

      <a
        href={linkHref}
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
        {linkText}
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
        {description}
      </p>

      {/* Animaciones + Responsividad */}
      <style>{`
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

        .fade-slide-left, .fade-slide-right, .fade-up {
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

        .fade-slide-right.show:hover {
          color: #1E40AF;
        }

        /* ✅ RESPONSIVIDAD */
        @media (max-width: 768px) {
          div {
            padding: 1.2rem !important;
            text-align: center !important;
          }
          h2 {
            font-size: 1rem !important;
          }
          a {
            font-size: 0.95rem !important;
            margin-top: 0.4rem !important;
          }
          p {
            font-size: 0.9rem !important;
            margin-top: 0.5rem !important;
          }
        }

        @media (max-width: 480px) {
          h2 {
            font-size: 0.95rem !important;
          }
          a {
            font-size: 0.9rem !important;
          }
          p {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeCenter;
