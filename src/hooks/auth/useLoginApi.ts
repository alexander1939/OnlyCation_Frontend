// src/hooks/auth/useLoginApi.ts
import { useEffect } from "react";
import { useLoginContext, type LoginCredentials, type LoginResponse } from "../../context/auth/LoginContext";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string)?.trim() || "http://localhost:8000/api";

export const useLoginApi = () => {
  const {
    user,
    setUser,
    loadingUser,
    setLoadingUser,
    loginLoading,
    setLoginLoading,
  } = useLoginContext();

  // 🟢 Cargar usuario del localStorage
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) setUser(storedUser);
    setLoadingUser(false);
  }, []);

  // 🟢 Login
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setLoginLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();
      console.log("[LoginAPI] Response:", data);

      if (!data.success || !data.data) {
        return { success: false, message: data.message || "Credenciales inválidas", data: null };
      }

      const { access_token, refresh_token, email, first_name, last_name, role } = data.data;

      // Guardar en localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", `${first_name} ${last_name}`);

      // Actualizar estado global
      setUser({ email, first_name, last_name, role });

      return data;
    } catch (error: any) {
      console.error("[LoginAPI] Error:", error);
      return {
        success: false,
        message: error.message || "Error durante el inicio de sesión",
        data: null,
      };
    } finally {
      setLoginLoading(false);
    }
  };

  // 🟢 Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    setUser(null);
  };

  // 🟢 Helper: obtener usuario guardado
  const getStoredUser = () => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");

    if (email && name && role) {
      const [first_name, last_name = ""] = name.split(" ");
      return { email, first_name, last_name, role };
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
