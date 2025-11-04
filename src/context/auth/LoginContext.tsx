// src/context/auth/LoginContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// 📩 Credenciales para login
export interface LoginCredentials {
  email: string;
  password: string;
}

// 👤 Datos del usuario autenticado
export interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status?: string | null;
  preference_id?: number | null;
}

// 📦 Respuesta del login
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
    status?: string | null;
    preference_id?: number | null;
  } | null;
}

// 🌍 Contexto global de autenticación
interface LoginContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loadingUser: boolean;
  setLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
  loginLoading: boolean;
  setLoginLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

// 🧩 Proveedor del contexto
export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  return (
    <LoginContext.Provider
      value={{
        user,
        setUser,
        loadingUser,
        setLoadingUser,
        loginLoading,
        setLoginLoading,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

// 🪄 Hook para acceder fácilmente al contexto
export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context)
    throw new Error("useLoginContext debe usarse dentro de LoginProvider");
  return context;
};
