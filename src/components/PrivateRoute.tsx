// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/auth/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[]; // 👈 opcional, para validar roles como "student" o "teacher"
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuthContext();

  // ⏳ Mientras se inicializa la sesión, evita redirecciones prematuras
  if (isLoading) {
    return <div style={{ padding: 16 }}>Cargando...</div>;
  }

  // 🚨 Si no hay usuario -> redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚨 Si hay roles definidos y el del usuario no coincide -> redirigir al home
  if (roles && !roles.includes((user.role || "").toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si pasa las validaciones, renderizamos el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;
