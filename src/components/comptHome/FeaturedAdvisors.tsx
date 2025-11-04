import React from "react";
import "../../styles/featured-advisors.css";

const advisors = [
  { name: "Prof. Carlos Mendoza", video: "https://www.youtube.com/embed/3icoSeGqQtY" },
  { name: "Lic. María González", video: "https://www.youtube.com/embed/3icoSeGqQtY" },
  { name: "Ing. David Torres", video: "https://www.youtube.com/embed/3icoSeGqQtY" },
];

// 🔹 Iniciales sin títulos
const getInitials = (fullName: string) => {
  const excludeWords = ["Prof.", "Lic.", "Ing.", "Mtro.", "Dra.", "Dr."];
  const filtered = fullName
    .split(" ")
    .filter((word) => !excludeWords.includes(word));
  return filtered
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
};

const FeaturedAdvisors: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gap: "0.7rem",
        fontFamily: "Roboto, sans-serif",
        maxHeight: "570px", // ⬆️ aumentado (antes 500px)
        overflowY: "auto",
        paddingRight: "0.4rem",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="scroll-vertical"
    >
      {/* Animaciones movidas a styles/featured-advisors.css */}

      {advisors.map((a) => (
        <div
          key={a.name}
          style={{
            background: "linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 100%)",
            borderRadius: "0.7rem",
            padding: "0.55rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 5px 10px rgba(37,99,235,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 2px 5px rgba(0,0,0,0.05)";
          }}
        >
          {/* 🔹 Video ajustado */}
          <div
            style={{
              width: "84%",
              aspectRatio: "16 / 8",
              borderRadius: "0.45rem",
              overflow: "hidden",
              marginBottom: "0.45rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              border: "1px solid #E5E7EB",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={a.video}
              title={a.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: "none",
              }}
            ></iframe>
          </div>

          {/* 🔹 Avatar + nombre */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              marginBottom: "0.4rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                boxShadow: "0 2px 5px rgba(37,99,235,0.3)",
                animation: "pulse 3s infinite ease-in-out",
              }}
            >
              {getInitials(a.name)}
            </div>

            <h4
              style={{
                margin: 0,
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#1E3A8A",
                textAlign: "left",
              }}
            >
              {a.name}
            </h4>
          </div>

          {/* 🔹 Botón compacto */}
          <button
            style={{
              backgroundColor: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: "0.35rem",
              fontWeight: 600,
              fontSize: "0.7rem",
              cursor: "pointer",
              transition: "all 0.25s ease",
              padding: "0.3rem 0.8rem",
              boxShadow: "0 0 3px rgba(37,99,235,0.4)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#1D4ED8";
              e.currentTarget.style.animation = "buttonGlow 1s infinite";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#2563EB";
              e.currentTarget.style.animation = "none";
            }}
          >
            Ver perfil
          </button>
        </div>
      ))}
    </div>
  );
};

export default FeaturedAdvisors;
