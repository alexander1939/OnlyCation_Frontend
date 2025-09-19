import { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from './useAuthApi';
import type { 
  User, 
  AuthState, 
  RegisterRequest 
} from '../../context/auth/types';

export const useAuthHook = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const authApi = useAuthApi();

  // Check if user is authenticated
  const isAuthenticated = useCallback((): boolean => {
    return !!localStorage.getItem('access_token');
  }, []);

  // Get current user information
  const getCurrentUser = useCallback((): User | null => {
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const role = localStorage.getItem('user_role');

    if (email && name && role) {
      // Generate a simple ID based on email for consistency
      const id = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
      return { id, email, name, role };
    }

    return null;
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const user = getCurrentUser();
          if (user) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
        
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, [isAuthenticated, getCurrentUser]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const user: User = {
          id: btoa(response.data.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8),
          name: `${response.data.first_name} ${response.data.last_name}`,
          email: response.data.email,
          role: response.data.role,
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: response.message || 'Error en el login' };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }, [authApi]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [authApi]);

  // Register student function
  const registerStudent = useCallback(async (userData: RegisterRequest) => {
    try {
      const response = await authApi.registerStudent(userData);
      return { 
        success: response.success, 
        error: response.success ? undefined : response.message 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error en el registro' 
      };
    }
  }, [authApi]);

  // Register teacher function
  const registerTeacher = useCallback(async (userData: RegisterRequest) => {
    try {
      const response = await authApi.registerTeacher(userData);
      return { 
        success: response.success, 
        error: response.success ? undefined : response.message 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error en el registro' 
      };
    }
  }, [authApi]);

  // Upload teacher documents function
  const uploadTeacherDocuments = useCallback(async (formData: FormData) => {
    try {
      await authApi.uploadTeacherDocuments(formData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error subiendo documentos' 
      };
    }
  }, [authApi]);

  // Request password reset function
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await authApi.requestPasswordReset(email);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error solicitando reset' 
      };
    }
  }, [authApi]);

  // Verify password reset function
  const verifyPasswordReset = useCallback(async (email: string, code: string, newPassword: string) => {
    try {
      await authApi.verifyPasswordReset(email, code, newPassword);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error verificando reset' 
      };
    }
  }, [authApi]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      return await authApi.refreshToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }, [authApi]);

  return {
    ...authState,
    login,
    logout,
    registerStudent,
    registerTeacher,
    uploadTeacherDocuments,
    requestPasswordReset,
    verifyPasswordReset,
    refreshToken,
  };
};
