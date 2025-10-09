// App.tsx
import { LoginProvider } from './context/auth/LoginContext';
import { ThemeProvider } from './context/ThemeContext'; // <-- ruta correcta
import AppRouter from './app/router';

function App() {
  return (
    <ThemeProvider>
      <LoginProvider>
        <AppRouter />
      </LoginProvider>
    </ThemeProvider>
  );
}

export default App;
