import { useAuthContext } from '../../context/auth';

// Hook pequeño ubicado en la carpeta auth para exponer el token
// y utilidades para obtener el rol desde el navegador (localStorage/JWT)
export const useAuthToken = () => {
  // Mantiene acceso al contexto por si se requiere información adicional
  const { user } = useAuthContext();

  const getCookie = (name: string): string | null => {
    try {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  };

  const getAccessToken = (): string | null => {
    const ls = localStorage.getItem('access_token');
    if (ls) return ls;
    // Fallback a cookies si no está en localStorage
    return getCookie('access_token') || getCookie('token') || null;
  };

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

  // Obtiene el rol: primero desde LoginContext, luego desde el JWT; si no, usa localStorage 'user_role'
  const getRoleFromToken = (): string | null => {
    if (user?.role) return user.role.toLowerCase();
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
    getCookie,
    parseJwt,
    getRoleFromToken,
    isTeacher,
    isStudent,
  };
};
