import { AuthProvider, ThemeProvider } from './context';
import Home from './pages/Home';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
