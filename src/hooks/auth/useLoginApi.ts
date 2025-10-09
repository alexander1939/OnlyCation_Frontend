import type { LoginRequest, LoginResponse } from "../../context/auth/LoginContext";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string)?.trim() || "http://localhost:8000/api";

export const useLoginApi = () => {
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const url = `${API_BASE_URL}/auth/login/`;
      console.log("[LoginAPI] URL de login:", url); // 🔹 Verifica la URL
      console.log("[LoginAPI] Credentials:", credentials); // 🔹 Verifica que los datos lleguen bien

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      console.log("[LoginAPI] Response status:", response.status);

      const data: LoginResponse = await response.json();
      console.log("[LoginAPI] Response data:", data);

      if (!data.success) {
        return { ...data, success: false, message: data.message || "Credenciales inválidasssss" };
      }

      if (data.data) {
        localStorage.setItem("access_token", data.data.access_token);
        localStorage.setItem("refresh_token", data.data.refresh_token);
        localStorage.setItem("user_email", data.data.email);
        localStorage.setItem("user_role", data.data.role || "student");
        localStorage.setItem(
          "user_name",
          `${data.data.first_name} ${data.data.last_name}`
        );
      }

      return data;
    } catch (error: any) {
      console.error("[LoginAPI] Error durante el login:", error);
      return {
        success: false,
        message: error.message || "Error desconocido durante el login",
        data: {
          access_token: "",
          refresh_token: "",
          token_type: "",
          email: "",
          first_name: "",
          last_name: "",
          role: "student",
        },
      };
    }
  };

  return { login };
};
