// src/context/auth/LoginContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useLoginApi } from "../../hooks/auth/useLoginApi";

// ----------------------------
// Tipos e interfaces para login
// ----------------------------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  } | null; // Ahora puede ser null si falla
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface LoginContextType {
  user: User | null;
  loadingUser: boolean;
  loginLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
}

// 🔹 Crear contexto sin valores por defecto engañosos
const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const { login: loginApi } = useLoginApi();

  // 🔹 Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");

    if (email && name && role) {
      const [first_name, last_name = ""] = name.split(" ");
      setUser({ email, first_name, last_name, role });
    }

    setLoadingUser(false);
  }, []);

  // 🔹 Función de login
  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    setLoginLoading(true);
    try {
      const result = await loginApi(credentials);

      if (result.success && result.data) {
        const role = result.data.role || "student";

        const loggedUser: User = {
          email: result.data.email,
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          role,
        };

        setUser(loggedUser);

        // Guardar en localStorage
        localStorage.setItem("access_token", result.data.access_token);
        localStorage.setItem("refresh_token", result.data.refresh_token);
        localStorage.setItem("user_email", result.data.email);
        localStorage.setItem("user_role", role);
        localStorage.setItem("user_name", `${result.data.first_name} ${result.data.last_name}`);
      }

      return result; // Retorna tal cual la API
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      return {
        success: false,
        message: error.message || "Error en el inicio de sesión",
        data: null, // nunca datos vacíos
      };
    } finally {
      setLoginLoading(false);
    }
  }, [loginApi]);

  // 🔹 Función de logout
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    setUser(null);
  }, []);

  return (
    <LoginContext.Provider value={{ user, loadingUser, loginLoading, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

// 🔹 Hook para usar el contexto
export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error("useLoginContext debe usarse dentro de un LoginProvider");
  return context;
};
