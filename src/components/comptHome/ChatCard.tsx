import React from "react";
import { useNavigate } from "react-router-dom";

interface ChatCardProps {
  title: string;
  description?: string;
  linkText: string;
  route: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  iconBg?: string;
}

const ChatCard: React.FC<ChatCardProps> = ({
  title,
  description,
  linkText,
  route,
  icon: Icon,
  iconColor = "#2563EB",
  iconBg = "#E6EEFF",
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        padding: "1.1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        height: "100%",
        fontFamily:
          "'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        {Icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon width={22} height={22} color={iconColor} />
          </div>
        )}
        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
          {title}
        </h3>
      </div>

      {description && (
        <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem", lineHeight: 1.45 }}>
          {description}
        </p>
      )}

      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => navigate(route)}
          style={{
            width: "100%",
            padding: "0.58rem 0.95rem",
            background: "#8ED4BE",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "0.75rem",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
            e.currentTarget.style.background = "#7BC7AD";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "#8ED4BE";
          }}
        >
          {linkText}
        </button>
      </div>
    </div>
  );
};

export default ChatCard;
