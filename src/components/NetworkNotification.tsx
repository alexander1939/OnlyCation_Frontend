import { useState, useEffect } from 'react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: (id: string) => void;
  autoClose?: number | false;
  index: number; // Para posicionar múltiples notificaciones
}

export default function NetworkNotification({ 
  id,
  message, 
  type, 
  isVisible, 
  onClose, 
  autoClose = 8000,
  index 
}: NotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto close si está configurado
      if (autoClose !== false) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoClose);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose]);

  const handleClose = () => {
    setIsAnimating(false);
    // Esperar a que termine la animación antes de eliminar completamente
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          borderColor: '#059669',
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          borderColor: '#D97706',
        };
      default:
        return {
          backgroundColor: '#6B7280',
          borderColor: '#4B5563',
        };
    }
  };

  const typeStyles = getTypeStyles();
  
  // Calcular posición basada en el índice (más reciente arriba)
  const topPosition = 80 + (index * 90); // 90px de separación entre notificaciones

  return (
    <div
      style={{
        position: 'fixed',
        top: `${topPosition}px`,
        right: '20px',
        width: '400px',
        backgroundColor: typeStyles.backgroundColor,
        color: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        minHeight: '70px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        zIndex: 9999 - index, // Más reciente tiene mayor z-index
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: '1.4',
        transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease',
          marginLeft: '12px',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ✕
      </button>
    </div>
  );
}
