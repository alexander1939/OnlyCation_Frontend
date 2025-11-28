import { LoginProvider } from './context/auth';
import { RegisterAuthProvider } from './context/regAuth';
import { ChatProvider } from './context/chat/ChatContext';
import AppRouter from './app/router';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { NotificationProvider } from './components/NotificationProvider';

function App() {
  console.log(' App: Componente montado');

  // Activar monitoreo de conexión
  const { isOnline, wasOffline, apiConnected } = useNetworkStatus();
  console.log(' App: Estado de red ->', { isOnline, wasOffline, apiConnected });

  return (
    <LoginProvider>
      <RegisterAuthProvider>
        <ChatProvider>
          <AppRouter />
        </ChatProvider>
      </RegisterAuthProvider>
    </LoginProvider>
  );
}

export default function AppWithNotifications() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}