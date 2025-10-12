import { LoginProvider } from './context/auth/LoginContext';
import AppRouter from './app/router';

function App() {
  return (
    <LoginProvider>
      <AppRouter />
    </LoginProvider>
  );
}

export default App;
