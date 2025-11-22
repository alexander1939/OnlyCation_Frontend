import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { createApiInterceptor } from './utils/apiErrorHandler.ts'
 
// Inicializar  interceptor de API para detectar errores de conexión
createApiInterceptor();

// Registra el service worker (desactivado temporalmente en desarrollo)
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}
*/

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    
  </>
)
