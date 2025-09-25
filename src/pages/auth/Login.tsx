import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";
import "../../styles/Login.css";

const Login: React.FC = () => {
  const { login, user, isLoading } = useAuthContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setError("");
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || "No se pudo iniciar sesión");
    }
    // 👈 OJO: NO navegamos aquí, dejamos que useEffect lo maneje
  };

  // 👀 La redirección depende de que ya tengamos user
  useEffect(() => {
    if (!user) return;

    switch (user.role?.toLowerCase()) {
      case "teacher":
        navigate("/teacher-home");
        break;
      case "student":
        navigate("/student-home");
        break;
      default:
        navigate("/");
        break;
    }
  }, [user, navigate]);

  return (
    <div className="page-container">
      <div className="login-card animate-card">
        <div className="login-card-content">
          {/* Lado izquierdo */}
          <div className="login-card-left">
            <div className="login-card-left-header">
              <LoginHeader />
            </div>
            <div className="login-card-left-image">
              <img src="/zorro_docnte_.png" alt="Decorativa" />
            </div>
          </div>

          {/* Lado derecho */}
          <div className="login-card-right">
            <div className="login-icon mb-6">
              <img src="/usuario.png" alt="Icono Login" />
            </div>

            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && (
              <p className="info-text">
                Ingresa tus credenciales para iniciar sesión
              </p>
            )}

            <p className="login-link" onClick={() => navigate("/register")}>
              ¿No tienes cuenta? <span>Regístrate</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
