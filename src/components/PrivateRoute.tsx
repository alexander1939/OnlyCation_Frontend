// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/auth";
import { useAuthToken } from "../hooks/auth/useAuthToken";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user } = useAuthContext();
  const { getAccessToken, getRoleFromToken, parseJwt } = useAuthToken();

  const token = getAccessToken();
  const role = getRoleFromToken();

  // Expiration fallback: if token exists but is expired, clear and force login
  if (token) {
    try {
      const payload = parseJwt<Record<string, any>>(token);
      const exp = payload?.exp ? Number(payload.exp) * 1000 : undefined;
      if (exp && Date.now() >= exp) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Sesión expirada. Inicia nuevamente.' }} />;
      }
    } catch {
      // ignore parse errors
    }
  }
  const isAuthenticated = Boolean(user) || Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Inicia sesión para continuar.' }} />;
  }

  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
