import React, { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "12px 40px 12px 16px", // espacio a la derecha para el icono
          borderRadius: "16px",
          border: `2px solid ${error ? "#EF4444" : "#E5E7EB"}`,
          fontSize: "16px",
          fontFamily: "Inter, sans-serif",
          transition: "all 0.3s ease",
        }}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "18px",
          color: "#6B7280",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {showPassword ? "👁️" : "👁️‍🗨️"}
      </span>
      {error && (
        <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
