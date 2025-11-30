import { useState, useEffect } from 'react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: (id: string) => void;
  autoClose?: number | false;
  index: number;
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
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          borderColor: '#86efac',
          iconColor: '#16a34a',
          textColor: '#15803d',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
          borderColor: '#fca5a5',
          iconColor: '#dc2626',
          textColor: '#991b1b',
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
          borderColor: '#fcd34d',
          iconColor: '#f59e0b',
          textColor: '#92400e',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          borderColor: '#d1d5db',
          iconColor: '#6b7280',
          textColor: '#374151',
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '!';
      case 'warning':
        return '⚠';
      default:
        return 'i';
    }
  };

  const typeStyles = getTypeStyles();
  const topPosition = 120 + (index * 80);

  return (
    <div
      style={{
        position: 'fixed',
        top: `${topPosition}px`,
        right: '16px',
        width: 'calc(100% - 32px)',
        maxWidth: '500px',
        background: typeStyles.background,
        borderLeft: `3px solid ${typeStyles.borderColor}`,
        borderRadius: '8px',
        padding: '18px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        zIndex: 9999 - index,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transform: isAnimating ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.95)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `${typeStyles.iconColor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '600',
          color: typeStyles.iconColor,
          flexShrink: 0,
        }}
      >
        {getIcon()}
      </div>

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: '15px',
          fontWeight: '500',
          lineHeight: '1.5',
          color: typeStyles.textColor,
          letterSpacing: '-0.01em',
          fontFamily: 'Roboto, sans-serif',
          paddingRight: '16px',
        }}
      >
        {message}
      </span>

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: typeStyles.textColor,
          fontSize: '22px',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          opacity: 0.5,
          flexShrink: 0,
          marginLeft: '32px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = `${typeStyles.iconColor}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.5';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        ×
      </button>
    </div>
  );
}
