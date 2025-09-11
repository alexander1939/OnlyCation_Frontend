import { AuthProvider, ThemeProvider } from './context';
import AppRouter from './app/router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
