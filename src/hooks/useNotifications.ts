import { useState } from 'react';

interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  autoClose?: number | false;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  // Función para mostrar notificación
  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'warning', 
    autoClose: number | false = 8000
  ) => {
    // Verificar si ya existe una notificación con el mismo mensaje
    const existingNotification = notifications.find(n => n.message === message);
    if (existingNotification) {
      console.log('📢 Notificación duplicada evitada:', message);
      return;
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newNotification: NotificationState = {
      id,
      message,
      type,
      isVisible: true,
      autoClose
    };
    
    // Agregar la nueva notificación al inicio del array (más reciente arriba)
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Función para remover notificación específica
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Función para limpiar todas las notificaciones
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Funciones de conveniencia para diferentes tipos
  const showSuccess = (message: string, autoClose: number | false = 8000) => {
    showNotification(message, 'success', autoClose);
  };

  const showError = (message: string, autoClose: number | false = 8000) => {
    showNotification(message, 'error', autoClose);
  };

  const showWarning = (message: string, autoClose: number | false = 8000) => {
    showNotification(message, 'warning', autoClose);
  };

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    removeNotification,
    clearAllNotifications
  };
};
