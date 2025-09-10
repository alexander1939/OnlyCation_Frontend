import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // Here you would check localStorage, cookies, or make an API call
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate API call to validate token
          // const user = await validateToken(token);
          // setAuthState({ user, isAuthenticated: true, isLoading: false });
        }
        setAuthState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      // Simulate login API call
      const response = { user: { id: '1', name: 'Usuario', email }, token: 'fake-token' };
      localStorage.setItem('authToken', response.token);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};

export default useAuth;
