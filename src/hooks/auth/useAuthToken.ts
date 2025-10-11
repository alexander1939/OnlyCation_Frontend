import { useAuthContext } from '../../context/auth/AuthContext';

// Hook pequeño ubicado en la carpeta auth para exponer el token
// y utilidades para obtener el rol desde el navegador (localStorage/JWT)
export const useAuthToken = () => {
  // Mantiene acceso al contexto por si se requiere información adicional
  useAuthContext();

  const getAccessToken = (): string | null => localStorage.getItem('access_token');

  // Decodifica un JWT (Base64URL) de manera segura
  const parseJwt = <T = any>(token: string): T | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as T;
    } catch {
      return null;
    }
  };

  // Intenta obtener el rol desde el JWT; si no, usa localStorage 'user_role'
  const getRoleFromToken = (): string | null => {
    const token = getAccessToken();
    if (token) {
      const payload = parseJwt<Record<string, any>>(token);
      const roleFromJwt = (payload?.role || payload?.roles || payload?.scope || payload?.permissions) as
        | string
        | string[]
        | undefined;
      if (Array.isArray(roleFromJwt) && roleFromJwt.length > 0) return String(roleFromJwt[0]).toLowerCase();
      if (typeof roleFromJwt === 'string' && roleFromJwt.trim().length > 0) return roleFromJwt.toLowerCase();
    }
    const lsRole = localStorage.getItem('user_role');
    return lsRole ? lsRole.toLowerCase() : null;
  };

  const isTeacher = (): boolean => getRoleFromToken() === 'teacher';
  const isStudent = (): boolean => getRoleFromToken() === 'student';

  return {
    getAccessToken,
    parseJwt,
    getRoleFromToken,
    isTeacher,
    isStudent,
  };
};
