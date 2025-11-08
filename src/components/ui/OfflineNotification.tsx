import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const OfflineNotification: React.FC = () => {
  const { isOnline, apiConnected } = useNetworkStatus();
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);
  const [previousApiState, setPreviousApiState] = useState(true);

  useEffect(() => {
    const isFullyConnected = isOnline && apiConnected;
    
    if (!isFullyConnected) {
      // Mostrar banner si no hay internet O si la API no responde
      setShowOfflineBanner(true);
      setShowReconnectedToast(false);
    } else {
      // Si se reconectó completamente, mostrar toast
      if (showOfflineBanner || !previousApiState) {
        setShowReconnectedToast(true);
        setTimeout(() => {
          setShowReconnectedToast(false);
        }, 4000);
      }
      setShowOfflineBanner(false);
    }
    
    setPreviousApiState(apiConnected);
  }, [isOnline, apiConnected, showOfflineBanner, previousApiState]);

  const getOfflineMessage = () => {
    if (!isOnline) {
      return "Sin conexión a internet - Modo offline activado";
    } else if (!apiConnected) {
      return "Servidor no disponible - Algunas funciones no están disponibles";
    }
    return "Modo sin conexión - Algunas funciones pueden no estar disponibles";
  };

  const getOfflineIcon = () => {
    if (!isOnline) {
      return "📡";
    } else if (!apiConnected) {
      return "🔧";
    }
    return "⚠️";
  };

  return (
    <>
      {/* Banner persistente cuando está offline o API no responde */}
      {showOfflineBanner && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: '0',
            right: '0',
            zIndex: 9998,
            backgroundColor: !isOnline ? '#FEF3C7' : '#FEE2E2',
            borderBottom: `2px solid ${!isOnline ? '#F59E0B' : '#EF4444'}`,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: !isOnline ? '#92400E' : '#991B1B',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span style={{ fontSize: '16px' }}>{getOfflineIcon()}</span>
          <span>{getOfflineMessage()}</span>
          <button
            onClick={() => setShowOfflineBanner(false)}
            style={{
              background: 'none',
              border: 'none',
              color: !isOnline ? '#92400E' : '#991B1B',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '0 4px',
              marginLeft: '12px'
            }}
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toast de reconexión */}
      {showReconnectedToast && (
        <div
          style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#D1FAE5',
            border: '2px solid #10B981',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#065F46',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '300px'
          }}
        >
          <span style={{ fontSize: '18px' }}>✅</span>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '2px' }}>
              ¡Conexión restaurada!
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Servidor y red funcionando correctamente
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animación */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default OfflineNotification;
