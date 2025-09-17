import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importación correcta

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Interfaz del payload que devuelve tu token JWT
interface TokenPayload {
  user_id: number;
  email: string;
  role: string;
  statuses: string;
  exp: number;
}

// 🔹 Tipo de retorno de login
interface LoginResult {
  success: boolean;
  role?: string;
  error?: string;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);

          setAuthState({
            user: {
              id: decoded.user_id.toString(),
              name: '', // opcional, nombre puede venir de token si lo agregas
              email: decoded.email,
              role: decoded.role,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error decoding token', error);
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Error al iniciar sesión';
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((d: any) => d.msg).join(', ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        }
        return { success: false, error: errorMessage };
      }

      const token = data.data.access_token;
      localStorage.setItem('authToken', token);

      const decoded = jwtDecode<TokenPayload>(token);

      setAuthState({
        user: {
          id: decoded.user_id.toString(),
          name: `${data.data.first_name} ${data.data.last_name}`,
          email: data.data.email,
          role: decoded.role,
        },
        isAuthenticated: true,
        isLoading: false,
      });

      // 🔹 Devuelve también el rol
      return { success: true, role: decoded.role };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};

export default useAuth;
