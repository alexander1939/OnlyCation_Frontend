import { useCallback } from 'react';
import type { 
  RegisterRequest, 
  RegisterResponse, 
  LoginRequest, 
  LoginResponse 
} from '../../context/auth/types';

// API configuration
const API_BASE_URL = '/api';

// Custom hook for authentication API calls
export const useAuthApi = () => {
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

  // Upload teacher documents API call
  const uploadTeacherDocuments = useCallback(async (formData: FormData): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/documents/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          // No incluir Content-Type para FormData, el browser lo maneja automáticamente
        },
        body: formData,
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading teacher documents:', error);
      throw error;
    }
  }, [handleResponse]);

  // Login API call
  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });

      const result = await handleResponse<LoginResponse>(response);
      
      // Guardar tokens en localStorage
      if (result.success && result.data) {
        localStorage.setItem('access_token', result.data.access_token);
        localStorage.setItem('refresh_token', result.data.refresh_token);
        localStorage.setItem('user_email', result.data.email);
        localStorage.setItem('user_role', result.data.role);
        localStorage.setItem('user_name', `${result.data.first_name} ${result.data.last_name}`);
      }

      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }, [getHeaders, handleResponse]);

  // Logout API call
  const logout = useCallback(async (): Promise<void> => {
    try {
      const email = localStorage.getItem('user_email');
      if (email) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: getHeaders(true),
          body: JSON.stringify({ email }),
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar localStorage independientemente del resultado
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
    }
  }, [getHeaders]);

  // Refresh token API call
  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token: refreshTokenValue }),
      });

      const result = await handleResponse<{
        success: boolean;
        data: { access_token: string; token_type: string };
      }>(response);

      if (result.success && result.data) {
        localStorage.setItem('access_token', result.data.access_token);
        return result.data.access_token;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Si falla el refresh, limpiar tokens
      await logout();
      return null;
    }
  }, [getHeaders, handleResponse, logout]);

  // Request password reset API call
  const requestPasswordReset = useCallback(async (email: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }, [getHeaders, handleResponse]);

  // Verify password reset API call
  const verifyPasswordReset = useCallback(async (email: string, code: string, newPassword: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/verify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error verifying password reset:', error);
      throw error;
    }
  }, [getHeaders, handleResponse]);

  return {
    registerStudent,
    registerTeacher,
    uploadTeacherDocuments,
    login,
    logout,
    refreshToken,
    requestPasswordReset,
    verifyPasswordReset,
  };
};
