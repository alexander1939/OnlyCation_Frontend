import { useCallback } from 'react';
import type { 
  RegisterRequest, 
  RegisterResponse, 
} from '../../context/regAuth/reg.types.ts';

// API configuration from environment
const envApiUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
const API_BASE_URL = envApiUrl && envApiUrl.trim().length > 0 ? envApiUrl : '/api';
if (!envApiUrl) {
  // eslint-disable-next-line no-console
  console.warn('[AuthAPI] VITE_API_URL no está definido. Usando fallback \'/api\'. Configura tu .env a partir de .envExample');
}

// Custom hook for authentication API calls
export const useRegisterAuthApi = () => {
  const getHeaders = useCallback((includeAuth: boolean = false): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }, []);

  const handleResponse = useCallback(async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        detail: 'Error de conexión con el servidor',
        status_code: response.status 
      }));
      throw new Error(errorData.detail || 'Error desconocido');
    }

    return response.json();
  }, []);

  // Register student API call
  const registerStudent = useCallback(async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/student/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      return handleResponse<RegisterResponse>(response);
    } catch (error) {
      console.error('Error registering student:', error);
      throw error;
    }
  }, [getHeaders, handleResponse]);

  // Register teacher API call
  const registerTeacher = useCallback(async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/teacher/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      return handleResponse<RegisterResponse>(response);
    } catch (error) {
      console.error('Error registering teacher:', error);
      throw error;
    }
  }, [getHeaders, handleResponse]);



  return {
    registerStudent,
    registerTeacher,
  };
};
