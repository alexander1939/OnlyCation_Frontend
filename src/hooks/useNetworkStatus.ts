import { useState, useEffect, useCallback } from 'react';
import { useNotificationContext } from '../components/NotificationProvider';
import { API_ERROR_EVENT, API_SUCCESS_EVENT } from '../utils/apiErrorHandler';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  apiConnected: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(true);

  const { showSuccess, showError } = useNotificationContext();

  const updatePageTitle = (online: boolean) => {
    const baseTitle = "OnlyCation - Aprende con los mejores profesores";

    if (!online) {
      document.title = "OnlyCation - Sin Internet";
    } else {
      document.title = baseTitle;
    }
  };

  const checkBackend = useCallback(async () => {
    return;
  }, []);

  useEffect(() => {
    // Sin chequeos automáticos al montar
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Sin chequeos adicionales; el estado del servidor se actualizará por eventos de la app
    };

    const handleFocus = () => {
      // Sin chequeos adicionales en focus
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setWasOffline(false);
        showSuccess('🌐 Conexión a internet restaurada');
        updatePageTitle(true);
      }
    };

    const handleOffline = () => {
      if (isOnline) {
        setIsOnline(false);
        setWasOffline(true);
        setApiConnected(false);
        showError('⚠️ Servidor no disponible - Modo offline');
        updatePageTitle(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, wasOffline, showError, showSuccess]);

  useEffect(() => {
    const onApiError = () => {
      if (navigator.onLine) {
        setApiConnected(false);
        showError('⚠️ Servidor no disponible - Modo offline');
        updatePageTitle(false);
      }
    };

    const onApiSuccess = () => {
      if (!apiConnected && navigator.onLine) {
        setApiConnected(true);
        showSuccess('✅ Conexión al servidor restaurada');
        updatePageTitle(true);
      }
    };

    window.addEventListener(API_ERROR_EVENT, onApiError as EventListener);
    window.addEventListener(API_SUCCESS_EVENT, onApiSuccess as EventListener);

    return () => {
      window.removeEventListener(API_ERROR_EVENT, onApiError as EventListener);
      window.removeEventListener(API_SUCCESS_EVENT, onApiSuccess as EventListener);
    };
  }, [apiConnected, showError, showSuccess]);

  return { 
    isOnline, 
    wasOffline, 
    apiConnected: isOnline && apiConnected
  };
};
