// src/hooks/auth/useUpdateProfile.ts
import { useState } from "react";
import axios from "axios";

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

export interface UpdateNameRequest {
    first_name?: string;
    last_name?: string;
}

// Respuesta directa del backend
export interface UserData {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

// Respuesta normalizada para el frontend
export interface UpdateNameResponse {
    success: boolean;
    message: string;
    data?: UserData;
}

export const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserName = async (
        updateData: UpdateNameRequest
    ): Promise<UpdateNameResponse> => {
        setLoading(true);
        setError(null);

        try {
            // El backend devuelve directamente el objeto de usuario
            const { data } = await api.patch<UserData>(
                "/users/me/name",
                updateData
            );

            console.log("[UpdateProfile] Response:", data);

            // Verificar que la respuesta tenga los campos necesarios
            if (!data.id || !data.email) {
                const errorMessage = "Respuesta inválida del servidor";
                setError(errorMessage);
                return {
                    success: false,
                    message: errorMessage,
                    data: undefined,
                };
            }

            // Actualizar localStorage con los nuevos datos
            if (data.first_name) {
                localStorage.setItem("user_first_name", data.first_name);
            }
            if (data.last_name) {
                localStorage.setItem("user_last_name", data.last_name);
            }
            // Actualizar también user_name para compatibilidad
            localStorage.setItem(
                "user_name",
                `${data.first_name} ${data.last_name}`
            );

            // Retornar en formato normalizado
            return {
                success: true,
                message: "Datos actualizados correctamente",
                data: data,
            };
        } catch (error: any) {
            console.error("[UpdateProfile] Error:", error);

            let message: string;
            const status = error?.response?.status;

            if (!error?.response || error?.code === "ERR_NETWORK") {
                message = "Servidor no disponible. Inténtalo más tarde.";
            } else if (status === 400) {
                message =
                    error.response?.data?.detail ||
                    "Datos inválidos. Verifica la información.";
            } else if (status === 401) {
                message = "No autorizado. Por favor inicia sesión nuevamente.";
            } else {
                message =
                    error.response?.data?.message ||
                    "Error al actualizar los datos. Intenta nuevamente.";
            }

            setError(message);
            return { success: false, message, data: undefined };
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserName,
        loading,
        error,
    };
};
