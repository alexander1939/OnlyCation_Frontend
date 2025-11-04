// src/hooks/auth/useLoginApi.ts
import axios from "axios";
import { useEffect } from "react";
import {
  useLoginContext,
  type LoginCredentials,
  type LoginResponse,
} from "../../context/auth/LoginContext";

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim();

if (!API_BASE_URL) {
  throw new Error("❌ Faltó definir VITE_API_URL en tu archivo .env");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Interceptor: agrega automáticamente el token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useLoginApi = () => {
  const {
    user,
    setUser,
    loadingUser,
    setLoadingUser,
    loginLoading,
    setLoginLoading,
  } = useLoginContext();

  // 🟢 Cargar usuario guardado del localStorage al iniciar
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) setUser(storedUser);
    setLoadingUser(false);
  }, []);

  // 🟢 Login (petición a la API)
  const login = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    setLoginLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/auth/login/", credentials);
      console.log("[LoginAPI] Response:", data);

      if (!data.success || !data.data) {
        return {
          success: false,
          message: data.message || "Credenciales inválidas",
          data: null,
        };
      }

      const {
        access_token,
        refresh_token,
        email,
        first_name,
        last_name,
        role,
        status,
        preference_id,
      } = data.data;

      // Guardar en localStorage 🧠
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", `${first_name} ${last_name}`);
      localStorage.setItem("user_status", status || "");
      localStorage.setItem("user_preference_id", preference_id?.toString() || "");

      // Actualizar estado global
      setUser({ email, first_name, last_name, role, status, preference_id });

      return data;
    } catch (error: any) {
      console.error("[LoginAPI] Error:", error);

      const message =
        error.response?.data?.message ||
        "Error durante el inicio de sesión. Intenta nuevamente.";

      return { success: false, message, data: null };
    } finally {
      setLoginLoading(false);
    }
  };

  // 🟢 Logout
  const logout = () => {
    [
      "access_token",
      "refresh_token",
      "user_email",
      "user_role",
      "user_name",
      "user_status",
      "user_preference_id",
    ].forEach((key) => localStorage.removeItem(key));

    setUser(null);
  };

  // 🟢 Helper: obtener usuario guardado del localStorage
  const getStoredUser = () => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");
    const status = localStorage.getItem("user_status");
    const preference_id = localStorage.getItem("user_preference_id");

    if (email && name && role) {
      const [first_name, last_name = ""] = name.split(" ");
      return {
        email,
        first_name,
        last_name,
        role,
        status,
        preference_id: preference_id ? Number(preference_id) : null,
      };
    }
    return null;
  };

  return {
    user,
    loadingUser,
    loginLoading,
    login,
    logout,
  };
};
