import { RegisterAuthProvider, ThemeProvider } from './context';
import AppRouter from './app/router';

function App() {
  return (
    <ThemeProvider>
      <RegisterAuthProvider>
        <AppRouter />
      </RegisterAuthProvider>
    </ThemeProvider>
  );
}

export default App
