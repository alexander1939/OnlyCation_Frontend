import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const usePasswordReset = () => {
  const requestPasswordReset = async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/password-reset/request`, { email });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Error al enviar el correo",
      };
    }
  };

  // Función para validar código (sin cambiar contraseña)
  const validateCode = async (email: string, code: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/password-reset/verify`, {
        email,
        code,
        // NO enviamos new_password para solo validar
      });
      return { 
        success: true, 
        message: response.data.message,
        validated: response.data.validated 
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Error al validar el código",
        validated: false
      };
    }
  };

  // Función para cambiar contraseña
  const changePasswordWithCode = async (email: string, code: string, newPassword: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/password-reset/verify`, {
        email,
        code,
        new_password: newPassword, // Ahora sí enviamos la contraseña
      });
      return { 
        success: true, 
        message: response.data.message,
        password_changed: response.data.password_changed 
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Error al cambiar la contraseña",
        password_changed: false
      };
    }
  };

  return {
    requestPasswordReset,
    validateCode,
    changePasswordWithCode,
  };
};