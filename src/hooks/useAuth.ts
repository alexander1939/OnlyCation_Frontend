import { useAuthContext } from '../context/auth/AuthContext';

// Small convenience hook that wraps the AuthContext and exposes a helper
// to retrieve the current access token from the centralized storage.
// This keeps token access consistent across hooks.
export const useAuth = () => {
  const ctx = useAuthContext();

  const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
  };

  return {
    ...ctx,
    getAccessToken,
  };
};

