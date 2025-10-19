import { LoginProvider } from './context/auth';
import { RegisterAuthProvider } from './context/regAuth';
import AppRouter from './app/router';

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
