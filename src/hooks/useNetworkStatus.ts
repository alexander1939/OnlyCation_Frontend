import { useState, useEffect, useCallback } from 'react';
import { useNotificationContext } from '../components/NotificationProvider';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  apiConnected: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  const [hasShownOffline, setHasShownOffline] = useState<boolean>(false);
  
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
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        
        console.log('🔍 Backend check:', { data, apiConnected, hasShownOffline });
        
        if (data && data.status === 'ok') {
          // Backend funcionando correctamente
          console.log('✅ Backend OK - Estado actual:', { apiConnected, hasShownOffline });
          
          if (!apiConnected && hasShownOffline) {
            console.log('📣 MOSTRANDO NOTIFICACIÓN DE CONEXIÓN RESTAURADA');
            setApiConnected(true);
            setHasShownOffline(false);
            showSuccess('🌐 Conexión restaurada');
            updatePageTitle(true);
          } else if (!hasShownOffline) {
            console.log('🟢 Primera conexión - no mostrar notificación');
            setApiConnected(true);
          } else {
            console.log('❓ Estado:', { apiConnected, hasShownOffline });
          }
        } else {
          // Backend responde pero sin status ok
          if (apiConnected || !hasShownOffline) {
            setApiConnected(false);
            setHasShownOffline(true);
            showError('⚠️ Servidor no disponible - Modo offline');
            updatePageTitle(false);
          }
        }
      } else {
        // Backend responde con error
        if (apiConnected || !hasShownOffline) {
          setApiConnected(false);
          setHasShownOffline(true);
          showError('⚠️ Servidor no disponible - Modo offline');
          updatePageTitle(false);
        }
      }
    } catch (error) {
      // Backend no disponible
      console.log('❌ Backend no disponible');
      if (apiConnected || !hasShownOffline) {
        setApiConnected(false);
        setHasShownOffline(true);
        showError('⚠️ Servidor no disponible - Modo offline');
        updatePageTitle(false);
      }
    }
  }, [apiConnected, hasShownOffline, showSuccess, showError]);

  // Verificar backend solo al inicio
  useEffect(() => {
    checkBackend();
  }, []);

  // Verificar backend cuando el usuario vuelve a la pestaña o ventana
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !apiConnected) {
        console.log('�️ Usuario volvió a la pestaña - verificando backend');
        checkBackend();
      }
    };

    const handleFocus = () => {
      if (!apiConnected) {
        console.log('🎯 Ventana enfocada - verificando backend');
        checkBackend();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [apiConnected, checkBackend]);

  useEffect(() => {
    const handleOnline = () => {
      if (wasOffline) {
        setIsOnline(true);
        setWasOffline(false);
        checkBackend();
      }
    };

    const handleOffline = () => {
      if (isOnline) {
        setIsOnline(false);
        setWasOffline(true);
        setApiConnected(false);
        setHasShownOffline(true);
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
  }, [isOnline, wasOffline, showError, checkBackend]);

  return { 
    isOnline, 
    wasOffline, 
    apiConnected: isOnline && apiConnected
  };
};
