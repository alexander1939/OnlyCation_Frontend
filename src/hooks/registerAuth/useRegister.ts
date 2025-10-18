import { useState, useEffect, useCallback } from 'react';
import { useRegisterAuthApi } from './useRegisterApi';
import type { 
  User, 
  AuthState, 
  RegisterRequest 
} from '../../context/registerAuth/types';

export const useRegisterAuthHook = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const authApi = useRegisterAuthApi();

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


  return {
    ...authState,
    registerStudent,
    registerTeacher,
  };
};
