// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useLoginContext } from "../context/auth/LoginContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[]; // 👈 opcional, para validar roles como "student" o "teacher"
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user } = useLoginContext();

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
