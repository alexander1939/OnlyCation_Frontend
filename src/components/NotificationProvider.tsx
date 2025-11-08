import React, { createContext, useContext } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NetworkNotification from './NetworkNotification';

interface NotificationContextType {
  showNotification: (message: string, type: 'success' | 'error' | 'warning', autoClose?: number | false) => void;
  showSuccess: (message: string, autoClose?: number | false) => void;
  showError: (message: string, autoClose?: number | false) => void;
  showWarning: (message: string, autoClose?: number | false) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext debe usarse dentro de NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        clearAllNotifications
      }}
    >
      {children}
      {notifications.map((notification, index) => (
        <NetworkNotification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={removeNotification}
          autoClose={notification.autoClose}
          index={index}
        />
      ))}
    </NotificationContext.Provider>
  );
};
