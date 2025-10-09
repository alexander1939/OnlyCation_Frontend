import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../../context/auth/LoginContext";
import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";
import "../../styles/Login.css";

const Login: React.FC = () => {
  const { login, user, loadingUser, loginLoading } = useLoginContext();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // 🔹 Manejo del login
  const handleLogin = async (email: string, password: string) => {
  setError("");
  try {
    const response = await login({ email, password });
    console.log("Respuesta login:", response);

    // Si no hay respuesta o login falló
    if (!response || !response.success || !response.data) {
      setError(response?.message || "Credenciales inválidas");
      return;
    }

    // Redirección según rol (ahora seguro)
    const role = response.data.role.toLowerCase();
    if (role === "teacher") navigate("/teacher-home");
    else if (role === "student") navigate("/student-home");
    else navigate("/");
  } catch (err: any) {
    console.error(err);
    setError(err.message || "No se pudo iniciar sesión");
  }
};



  // 🔹 Redirección automática según rol
  useEffect(() => {
    if (!user || loadingUser) return;

    switch (user.role.toLowerCase()) {
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
  }, [user, loadingUser, navigate]);

  return (
    <div className="login-page">
      <div className="page-container">
        <div className="login-card animate-card">
          <div className="login-card-content">

            {/* Lado izquierdo */}
            <div className="login-card-left">
              <div className="login-card-left-header">
                <LoginHeader />
              </div>
              <div className="login-card-left-image">
                <img src="/login_mascota.png" alt="Decorativa" />
              </div>
            </div>

            {/* Lado derecho */}
            <div className="login-card-right">
              <div className="login-icon mb-6">
                <img src="/usuario.png" alt="Icono Login" />
              </div>

              <LoginForm onSubmit={handleLogin} isLoading={loginLoading} />

              {error && <p className="error-text">{error}</p>}

              {!loginLoading && !loadingUser && !error && (
                <p className="info-text">Ingresa tus credenciales para iniciar sesión</p>
              )}

              <p className="login-link" onClick={() => navigate("/register")}>
                ¿No tienes cuenta? <span>Regístrate</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
