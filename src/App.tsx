import { LoginProvider } from './context/auth';
import { RegisterAuthProvider } from './context/regAuth';
import AppRouter from './app/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PWAInstaller from './components/PWAInstaller';

function App() {
  return (
    <LoginProvider>
      <RegisterAuthProvider>
        <AppRouter />
      </RegisterAuthProvider>
    </LoginProvider>
  );
}

export default App;