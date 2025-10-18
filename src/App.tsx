import { LoginProvider } from './context/auth/LoginContext';
import AppRouter from './app/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PWAInstaller from './components/PWAInstaller';

function App() {
  return (
    <LoginProvider>
      <AppRouter />
    </LoginProvider>
  );
}

export default App;
