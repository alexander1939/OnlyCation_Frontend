import { AuthProvider, ThemeProvider, DocumentsProvider, PreferencesProvider } from './context';
import AppRouter from './app/router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PreferencesProvider>
          <DocumentsProvider>
            <AppRouter />
          </DocumentsProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
