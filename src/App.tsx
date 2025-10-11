import { AuthProvider, ThemeProvider } from './context';
import AppRouter from './app/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PWAInstaller from './components/PWAInstaller';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <PWAInstaller />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
