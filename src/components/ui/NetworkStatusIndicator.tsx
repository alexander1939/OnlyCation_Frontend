import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<'offline' | 'online'>('offline');

  useEffect(() => {
    if (!isOnline) {
      // Mostrar mensaje de offline
      setMessageType('offline');
      setShowMessage(true);
    } else if (wasOffline && isOnline) {
      // Mostrar mensaje de reconexión
      setMessageType('online');
      setShowMessage(true);
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [isOnline, wasOffline]);

  if (!showMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '12px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        backgroundColor: messageType === 'offline' ? '#EF4444' : '#10B981',
        color: '#FFFFFF',
        border: `2px solid ${messageType === 'offline' ? '#DC2626' : '#059669'}`,
      }}
    >
      <span style={{ fontSize: '16px' }}>
        {messageType === 'offline' ? '📡' : '✅'}
      </span>
      <span>
        {messageType === 'offline' 
          ? 'Sin conexión a internet' 
          : 'Conexión restaurada'
        }
      </span>
      {messageType === 'offline' && (
        <button
          onClick={() => setShowMessage(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0 4px',
            marginLeft: '8px'
          }}
          aria-label="Cerrar mensaje"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;
