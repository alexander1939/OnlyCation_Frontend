import React, { useEffect, useState } from "react";
import "../../styles/knowledge-center.css";

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
      className="knowledge-center"
      style={{
        backgroundColor,
        border: "1px solid #C9E2FF",
        borderRadius: "0.75rem",
        padding: "1.2rem",
        fontFamily: "Roboto, sans-serif",
        textAlign: "left",
        color: "#1E293B",
        lineHeight: 1.6,
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
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
        }}
      >
        {description}
      </p>

      {/* Animaciones movidas a styles/knowledge-center.css */}
    </div>
  );
};

export default KnowledgeCenter;
