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
  const [wasApiDisconnected, setWasApiDisconnected] = useState<boolean>(false);
  
  const { showSuccess, showError, showWarning } = useNotificationContext();

  console.log('🔍 useNetworkStatus: Estado actual ->', { isOnline, wasOffline, apiConnected, wasApiDisconnected });

  // Función para actualizar título de la página
  const updatePageTitle = (online: boolean, apiConnected: boolean) => {
    const baseTitle = "OnlyCation - Aprende con los mejores profesores";
    
    if (!online) {
      document.title = "OnlyCation - Sin Internet";
    } else if (!apiConnected) {
      document.title = "OnlyCation - Sin Conexión";
    } else {
      document.title = baseTitle;
    }
  };

  // Función para verificar conectividad con la API
  const checkApiConnection = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          // Si el servidor se reconectó después de estar desconectado
          setWasApiDisconnected(prev => {
            if (prev) {
              console.log('📣 SERVIDOR RECONECTADO - Mostrando notificación');
              showSuccess('✅ Conexión al servidor restaurada');
              return false;
            }
            return prev;
          });
          setApiConnected(true);
        } else {
          setWasApiDisconnected(prev => {
            if (!prev) {
              return true;
            }
            return prev;
          });
          setApiConnected(false);
        }
      } else {
        setWasApiDisconnected(prev => {
          if (!prev) {
            return true;
          }
          return prev;
        });
        setApiConnected(false);
      }
    } catch (error) {
      setWasApiDisconnected(prev => {
        if (!prev) {
          return true;
        }
        return prev;
      });
      setApiConnected(false);
    }
  }, [showSuccess]);

  useEffect(() => {
    
    const handleOnline = () => {
      console.log('🔥 EVENTO ONLINE DETECTADO!!! navigator.onLine:', navigator.onLine);
      setIsOnline(true);
      checkApiConnection();
      if (wasOffline) {
        setWasOffline(false);
        console.log('📣 Showing success notification...');
        showSuccess('🌐 Conexión a internet restaurada');
      }
    };

    const handleOffline = () => {
      console.log('🔥 EVENTO OFFLINE DETECTADO!!! navigator.onLine:', navigator.onLine);
      setIsOnline(false);
      setApiConnected(false);
      setWasOffline(true);
      console.log('📣 Showing error notification...');
      showError('⚠️ Servidor no disponible - Modo offline');
    };

    // PRUEBA DIRECTA - Disparar eventos manualmente
    console.log('🚀 PRUEBA DIRECTA - Disparando eventos manualmente');
    setTimeout(() => {
      console.log('🔥 SIMULANDO OFFLINE');
      setWasOffline(true);
      showError('⚠️ Servidor no disponible - Modo offline');
    }, 2000);
    
    setTimeout(() => {
      console.log('🔥 SIMULANDO ONLINE');
      showSuccess('🌐 Conexión a internet restaurada');
    }, 4000);

    // Event listeners para conexión de red
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar API cada 30 segundos si está online
    const apiCheckInterval = setInterval(() => {
      if (isOnline) {
        checkApiConnection();
      }
    }, 30000);

    // Verificación inicial
    if (isOnline) {
      checkApiConnection();
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(apiCheckInterval);
    };
  }, [isOnline, wasOffline, checkApiConnection]);

  useEffect(() => {
    updatePageTitle(isOnline, apiConnected);
    
    // Solo mostrar notificación cuando cambie el estado de la API (no al inicio)
    if (isOnline && !apiConnected && !wasApiDisconnected) {
      setWasApiDisconnected(true);
      console.log('📣 Showing warning notification...');
      showWarning('⚠️ Servidor no disponible - Modo offline');
    }
  }, [isOnline, apiConnected]);

  return { 
    isOnline, 
    wasOffline, 
    apiConnected: isOnline && apiConnected
  };
};
