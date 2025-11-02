// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useLoginContext } from "../context/auth/LoginContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[]; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user } = useLoginContext();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes((user.role || "").toLowerCase())) {
    return <Navigate to="/" replace />;
  }
  

  // ✅ Si pasa las validaciones, renderizamos el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;
