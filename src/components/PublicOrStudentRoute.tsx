import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth';
import { useAuthToken } from '../hooks/auth/useAuthToken';

interface Props {
  children: React.ReactNode;
}

// Permite acceso a invitados y alumnos. Bloquea docentes.
export default function PublicOrStudentRoute({ children }: Props) {
  const { user } = useAuthContext();
  const { getAccessToken, getRoleFromToken, parseJwt } = useAuthToken();

  const token = getAccessToken();
  const role = getRoleFromToken();

  if (token) {
    try {
      const payload = parseJwt<Record<string, any>>(token);
      const exp = payload?.exp ? Number(payload.exp) * 1000 : undefined;
      if (exp && Date.now() >= exp) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
      }
    } catch {
      // ignore parse errors
    }
  }

  const isTeacher = (user?.role ?? role) === 'teacher';

  if (isTeacher) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
